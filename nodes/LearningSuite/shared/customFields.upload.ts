import { NodeOperationError } from 'n8n-workflow';
import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { lsRequest } from './request';

type FileType = 'files' | 'images' | 'videos' | 'audios';

interface UploadSpec {
	type: string;
	uploadUrl: string;
	requestHeaders?: Record<string, string>;
}

interface CreateFileResponse {
	fileId: string;
	uploadSpec: UploadSpec;
}

interface UploadedFileValue {
	fileId: string;
	mimeType: string;
	fileSize: number;
	[key: string]: unknown;
}

function resolveFileType(fieldType: string): FileType {
	return fieldType as FileType;
}

/**
 * Creates a file slot in the LearningSuite custom-field store for a given user.
 * Returns the fileId and the uploadSpec describing how/where to upload.
 */
async function createFileSlot(
	ctx: IExecuteFunctions,
	userId: string,
	customFieldKey: string,
	fileName?: string,
): Promise<CreateFileResponse> {
	const body: IDataObject = { customFieldKey };
	if (fileName) {
		body.fileName = fileName;
	}

	const response = (await lsRequest.call(ctx, 'POST', `/custom-fields/store/${userId}/files`, {
		body,
	})) as IDataObject;

	const fileId = response.fileId as string | undefined;
	const uploadSpec = response.uploadSpec as UploadSpec | undefined;

	if (!fileId || !uploadSpec) {
		throw new NodeOperationError(ctx.getNode(), 'Upload spec or fileId missing in the response from create file API');
	}

	return { fileId, uploadSpec };
}

/**
 * Uploads a file buffer via a simple HTTP PUT (for uploadSpec.type === 'storage').
 */
async function uploadViaStorage(
	ctx: IExecuteFunctions,
	uploadSpec: UploadSpec,
	buffer: Buffer,
	contentType: string,
): Promise<void> {
	await ctx.helpers.httpRequest({
		method: 'PUT',
		url: uploadSpec.uploadUrl,
		headers: {
			...uploadSpec.requestHeaders,
			'Content-Type': contentType,
			'Content-Length': String(buffer.length),
		},
		body: buffer,
		json: false,
	});
}

const TUS_CHUNK_SIZE = 5 * 1024 * 1024;
const TUS_MAX_RETRIES = 4;

/**
 * Uploads a file buffer via the tus resumable upload protocol (for videos).
 * 1. POST to create the upload resource (returns Location header)
 * 2. PATCH in chunks until all bytes are uploaded
 */
async function uploadViaTus(
	ctx: IExecuteFunctions,
	uploadSpec: UploadSpec,
	buffer: Buffer,
	fileName: string,
	contentType: string,
): Promise<void> {
	const metadataHeader = [
		`filename ${Buffer.from(fileName).toString('base64')}`,
		`filetype ${Buffer.from(contentType).toString('base64')}`,
	].join(',');

	const createResponse = await ctx.helpers.httpRequest({
		method: 'POST',
		url: uploadSpec.uploadUrl,
		headers: {
			...uploadSpec.requestHeaders,
			'Tus-Resumable': '1.0.0',
			'Upload-Length': String(buffer.length),
			'Upload-Metadata': metadataHeader,
			'Content-Length': '0',
		},
		body: Buffer.alloc(0),
		json: false,
		returnFullResponse: true,
	});

	const location: string | undefined = createResponse.headers?.['location'] ?? createResponse.headers?.['Location'];
	if (!location) {
		throw new NodeOperationError(ctx.getNode(), 'tus creation response missing Location header');
	}
	const uploadUrl = location.startsWith('http') ? location : new URL(location, uploadSpec.uploadUrl).toString();

	let offset = 0;
	while (offset < buffer.length) {
		const chunk = buffer.subarray(offset, Math.min(offset + TUS_CHUNK_SIZE, buffer.length));
		let lastError: Error | undefined;

		for (let attempt = 0; attempt <= TUS_MAX_RETRIES; attempt++) {
			try {
				const patchResponse = await ctx.helpers.httpRequest({
					method: 'PATCH',
					url: uploadUrl,
					headers: {
						...uploadSpec.requestHeaders,
						'Tus-Resumable': '1.0.0',
						'Upload-Offset': String(offset),
						'Content-Type': 'application/offset+octet-stream',
						'Content-Length': String(chunk.length),
					},
					body: chunk,
					json: false,
					returnFullResponse: true,
				});

				const newOffset = parseInt(
					patchResponse.headers?.['upload-offset'] ?? patchResponse.headers?.['Upload-Offset'] ?? '',
					10,
				);
				if (isNaN(newOffset)) {
					throw new Error('tus PATCH response missing Upload-Offset header');
				}
				offset = newOffset;
				lastError = undefined;
				break;
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));
			}
		}

		if (lastError) {
			throw new NodeOperationError(
				ctx.getNode(),
				`tus upload failed after ${TUS_MAX_RETRIES + 1} attempts: ${lastError.message}`,
			);
		}
	}
}

/**
 * Builds the file value object to be stored on the custom field,
 * matching the structure expected by the LearningSuite API.
 */
function createUploadedFileValue(
	fileType: FileType,
	fileId: string,
	file: { mimeType: string; fileName: string; fileSize: number },
): UploadedFileValue {
	switch (fileType) {
		case 'files':
			return {
				fileId,
				mimeType: file.mimeType,
				fileSize: file.fileSize,
				name: file.fileName,
			};
		case 'images':
			return {
				fileId,
				mimeType: file.mimeType,
				fileSize: file.fileSize,
				previewThumb: '',
				dimensions: { width: 0, height: 0 },
				meanColor: '#000000',
				dominantColor: '#000000',
			};
		case 'videos':
			return {
				fileId,
				mimeType: file.mimeType,
				fileSize: file.fileSize,
				thumbnailFileId: undefined,
				aspectRatio: undefined,
				duration: undefined,
			};
		case 'audios':
			return {
				fileId,
				mimeType: file.mimeType,
				fileSize: file.fileSize,
				duration: undefined,
			};
		default:
			throw new Error(`Unsupported custom field file type: ${fileType as string}`);
	}
}

/**
 * Full upload flow for a single binary property:
 * 1. Create file slot via LS API
 * 2. Upload the binary data via HTTP PUT
 * 3. Return the file value object to store on the custom field
 */
async function uploadSingleFile(
	ctx: IExecuteFunctions,
	itemIndex: number,
	userId: string,
	customFieldKey: string,
	binaryPropertyName: string,
	fieldType: string,
	fileNameOverride?: string,
): Promise<UploadedFileValue> {
	const binaryData = ctx.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const buffer = await ctx.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	const fileType = resolveFileType(fieldType);
	const mimeType = binaryData.mimeType || 'application/octet-stream';
	const fileName = fileNameOverride || binaryData.fileName || 'upload';

	const { fileId, uploadSpec } = await createFileSlot(ctx, userId, customFieldKey, fileName);

	if (uploadSpec.type === 'storage') {
		await uploadViaStorage(ctx, uploadSpec, buffer, mimeType);
	} else {
		await uploadViaTus(ctx, uploadSpec, buffer, fileName, mimeType);
	}

	return createUploadedFileValue(fileType, fileId, {
		mimeType,
		fileName,
		fileSize: buffer.length,
	});
}

/**
 * Uploads one or more binary properties and returns the array of file value objects.
 * The binaryPropertyNames parameter can be a comma-separated list (e.g. "data,file1,file2").
 */
export async function uploadFilesFromBinaryProperties(
	ctx: IExecuteFunctions,
	itemIndex: number,
	userId: string,
	customFieldKey: string,
	binaryPropertyNames: string,
	fieldType: string,
	fileNameOverride?: string,
): Promise<UploadedFileValue[]> {
	const names = binaryPropertyNames
		.split(',')
		.map((n) => n.trim())
		.filter((n) => n.length > 0);

	if (names.length === 0) {
		throw new NodeOperationError(ctx.getNode(), 'No binary property name provided for file upload.');
	}

	const results: UploadedFileValue[] = [];

	for (const name of names) {
		const value = await uploadSingleFile(ctx, itemIndex, userId, customFieldKey, name, fieldType, fileNameOverride);
		results.push(value);
	}

	return results;
}
