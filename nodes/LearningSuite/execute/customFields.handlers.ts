import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { lsRequest, uploadFilesFromBinaryProperties } from '../shared';
import type { ExecuteHandler } from '../exec.types';

type LsType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'date'
	| 'time'
	| 'dateTime'
	| 'select'
	| 'files'
	| 'images'
	| 'videos'
	| 'audios';

type ExecuteContext = IExecuteFunctions;
type FileValueMode = 'add' | 'replace' | 'replaceIfFull';

const FILE_FIELD_TYPES = new Set(['files', 'images', 'videos', 'audios']);

interface ExpandedCustomFieldCard {
	id?: string;
	multipleProfilesAllowed?: boolean;
	definitions?: Array<{
		key?: string;
		typeDefinition?: {
			type?: string;
			maxFiles?: number;
			maxImages?: number;
			maxVideos?: number;
			maxAudios?: number;
		};
	}>;
}

interface PublicUrlFileFieldContext {
	cardId: string;
	type: LsType;
	maxItems?: number;
	multipleProfilesAllowed: boolean;
}

interface MediaTypeDefinition {
	maxFiles?: number;
	maxImages?: number;
	maxVideos?: number;
	maxAudios?: number;
}

function normalizeSingleFieldValueOrFail(ctx: ExecuteContext, input: unknown, fieldKey: string, lsType: LsType) {
	if (input === undefined || input === null) {
		throw new NodeOperationError(ctx.getNode(), `No value provided for custom field "${fieldKey}".`);
	}

	let value: unknown = input;

	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		const record = value as Record<string, unknown>;
		const values = Object.values(record);
		if (values.length === 1) {
			value = values[0];
		}
	}

	if (lsType === 'select') {
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (trimmed.startsWith('[')) {
				try {
					const parsed = JSON.parse(trimmed);
					if (Array.isArray(parsed)) {
						return parsed;
					}
				} catch {
					// Fall back to treating the incoming value as a single option below.
				}
			}
		}
		return Array.isArray(value) ? value : [value];
	}

	if (['files', 'images', 'videos', 'audios'].includes(lsType)) {
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
				try {
					value = JSON.parse(trimmed);
				} catch {
					// Keep the original string when it is not valid JSON.
				}
			}
		}

		if (Array.isArray(value)) {
			return value.map((item) => {
				if (typeof item === 'object' && item !== null && 'data' in item) {
					const bin = item as Record<string, unknown>;
					const fileData: Record<string, unknown> = { data: bin.data };
					if ('fileName' in bin && bin.fileName) fileData.name = bin.fileName;
					if ('mimeType' in bin && bin.mimeType) fileData.mimeType = bin.mimeType;
					if ('fileSize' in bin && typeof bin.fileSize === 'number') fileData.fileSize = bin.fileSize;
					return fileData;
				}
				return item;
			});
		}

		if (typeof value === 'object' && value !== null && 'data' in value) {
			const bin = value as Record<string, unknown>;
			const fileData: Record<string, unknown> = { data: bin.data };
			if ('fileName' in bin && bin.fileName) fileData.name = bin.fileName;
			if ('mimeType' in bin && bin.mimeType) fileData.mimeType = bin.mimeType;
			if ('fileSize' in bin && typeof bin.fileSize === 'number') fileData.fileSize = bin.fileSize;
			return [fileData];
		}

		return Array.isArray(value) ? value : [value];
	}

	if (lsType === 'date' || lsType === 'dateTime' || lsType === 'time') {
		if (typeof value === 'string') {
			return value;
		}
		throw new NodeOperationError(
			ctx.getNode(),
			`Invalid value for date/time custom field "${fieldKey}". Expected a string, got ${typeof value}.`,
		);
	}

	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return value;
	}

	throw new NodeOperationError(ctx.getNode(), `Invalid value for custom field "${fieldKey}" (${lsType}).`);
}

function normalizeCustomFieldValue(response: unknown): IDataObject {
	if (!Array.isArray(response)) {
		return { value: response ?? null };
	}
	if (response.length === 0) return { value: null };
	if (response.length === 1) return { value: response[0] };
	return { value: response };
}

function normalizeValuesArray(value: unknown): unknown[] {
	if (value === undefined || value === null) {
		return [];
	}
	return Array.isArray(value) ? value : [value];
}

function normalizeStoreFileValuesResponse(response: unknown): unknown[] {
	if (!Array.isArray(response)) {
		return normalizeValuesArray(response);
	}

	if (response.length === 0) {
		return [];
	}

	if (response.length === 1 && Array.isArray(response[0])) {
		return response[0];
	}

	return response;
}

function normalizeFileValuesResponse(response: unknown): unknown[] {
	return normalizeStoreFileValuesResponse(response);
}

function normalizeProfileIndex(value: unknown): number | undefined {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : undefined;
	}

	return undefined;
}

function getMediaFieldLimit(type: LsType, typeDefinition: MediaTypeDefinition): number | undefined {
	switch (type) {
		case 'files':
			return typeDefinition.maxFiles;
		case 'images':
			return typeDefinition.maxImages;
		case 'videos':
			return typeDefinition.maxVideos;
		case 'audios':
			return typeDefinition.maxAudios;
		default:
			return undefined;
	}
}

function buildProfileSelector(ctx: ExecuteContext, i: number): IDataObject {
	const profileId = ctx.getNodeParameter('profileId', i, '') as string;
	const profileIndex = normalizeProfileIndex(ctx.getNodeParameter('profileIndex', i, ''));
	const profileName = ctx.getNodeParameter('profileName', i, '') as string;

	const selector: IDataObject = {};
	if (profileId) {
		selector.profileId = profileId;
	} else if (profileIndex !== undefined) {
		selector.profileIndex = profileIndex;
	} else if (profileName) {
		selector.profileName = profileName;
	}

	return selector;
}

function hasProfileSelector(selector: IDataObject): boolean {
	return selector.profileId !== undefined || selector.profileIndex !== undefined || selector.profileName !== undefined;
}

function getEffectiveProfileSelector(fieldContext: PublicUrlFileFieldContext, selector: IDataObject): IDataObject {
	return fieldContext.multipleProfilesAllowed ? selector : {};
}

async function cardAllowsMultipleProfiles(ctx: ExecuteContext, cardId: string): Promise<boolean> {
	const cards = await lsRequest.call(ctx, 'GET', '/custom-fields/cards');

	if (!Array.isArray(cards)) {
		return false;
	}

	const card = cards.find((entry) => {
		if (typeof entry !== 'object' || entry === null) return false;
		return (entry as IDataObject).id === cardId;
	});

	if (!card || typeof card !== 'object') {
		return false;
	}

	return (card as IDataObject).multipleProfilesAllowed === true;
}

function getFileValueMode(ctx: ExecuteContext, i: number): FileValueMode {
	return ctx.getNodeParameter('fileValueMode', i, 'add') as FileValueMode;
}

function countBinaryPropertyNames(binaryPropertyNames: string): number {
	return binaryPropertyNames
		.split(',')
		.map((name) => name.trim())
		.filter((name) => name.length > 0).length;
}

function findFileFieldContext(
	ctx: ExecuteContext,
	cards: ExpandedCustomFieldCard[],
	customFieldKey: string,
): PublicUrlFileFieldContext {
	for (const card of cards) {
		if (!card?.id || !Array.isArray(card.definitions)) {
			continue;
		}

		const definition = card.definitions.find((def) => def?.key === customFieldKey);
		if (!definition) {
			continue;
		}

		const type = String(definition.typeDefinition?.type ?? '') as LsType;
		if (!FILE_FIELD_TYPES.has(type)) {
			throw new NodeOperationError(
				ctx.getNode(),
				`Custom field "${customFieldKey}" is not a file, image, video, or audio field.`,
			);
		}

		return {
			cardId: card.id,
			type,
			maxItems: getMediaFieldLimit(type, definition.typeDefinition ?? {}),
			multipleProfilesAllowed: card.multipleProfilesAllowed === true,
		};
	}

	throw new NodeOperationError(ctx.getNode(), `Unknown custom field "${customFieldKey}".`);
}

async function getPublicUrlFileFieldContext(
	ctx: ExecuteContext,
	customFieldKey: string,
): Promise<PublicUrlFileFieldContext> {
	const cardsResponse = await lsRequest.call(ctx, 'GET', '/custom-fields/cards/expanded');

	if (!Array.isArray(cardsResponse)) {
		throw new NodeOperationError(ctx.getNode(), 'Failed to load custom field definitions.');
	}

	return findFileFieldContext(ctx, cardsResponse as ExpandedCustomFieldCard[], customFieldKey);
}

async function readExistingFileValues(
	ctx: ExecuteContext,
	userId: string,
	customFieldKey: string,
	fieldContext: PublicUrlFileFieldContext,
	profileSelector: IDataObject,
	forceProfileContext = false,
): Promise<{ existingValues: unknown[]; useProfileContext: boolean }> {
	const effectiveProfileSelector = getEffectiveProfileSelector(fieldContext, profileSelector);
	const useProfileContext =
		forceProfileContext || fieldContext.multipleProfilesAllowed || hasProfileSelector(effectiveProfileSelector);

	if (useProfileContext) {
		const existingProfileValues = await lsRequest.call(
			ctx,
			'GET',
			`/custom-fields/store/${userId}/profiles/by-card/${fieldContext.cardId}`,
			{ qs: effectiveProfileSelector },
		);
		return {
			existingValues: normalizeFileValuesResponse((existingProfileValues as IDataObject)?.[customFieldKey]),
			useProfileContext,
		};
	}

	const existingFieldValues = await lsRequest.call(
		ctx,
		'GET',
		`/custom-fields/store/${userId}/fields/${customFieldKey}`,
	);
	return {
		existingValues: normalizeStoreFileValuesResponse(existingFieldValues),
		useProfileContext,
	};
}

function assertFileValueCountWithinLimit(
	ctx: ExecuteContext,
	customFieldKey: string,
	valueCount: number,
	maxItems?: number,
): void {
	if (maxItems !== undefined && valueCount > maxItems) {
		throw new NodeOperationError(
			ctx.getNode(),
			`Cannot set custom field "${customFieldKey}". Maximum of ${maxItems} file values would be exceeded.`,
		);
	}
}

function buildNextFileValues(
	ctx: ExecuteContext,
	customFieldKey: string,
	existingValues: unknown[],
	uploadedValues: unknown[],
	maxItems: number | undefined,
	mode: FileValueMode,
): unknown[] {
	assertFileValueCountWithinLimit(ctx, customFieldKey, uploadedValues.length, maxItems);

	if (mode === 'replace') {
		return uploadedValues;
	}

	const appendedValues = [...existingValues, ...uploadedValues];

	if (maxItems === undefined || appendedValues.length <= maxItems) {
		return appendedValues;
	}

	if (mode === 'replaceIfFull') {
		return uploadedValues;
	}

	throw new NodeOperationError(
		ctx.getNode(),
		`Cannot add file to custom field "${customFieldKey}". Maximum of ${maxItems} would be exceeded.`,
	);
}

async function writeFileValues(
	ctx: ExecuteContext,
	userId: string,
	customFieldKey: string,
	fieldContext: PublicUrlFileFieldContext,
	profileSelector: IDataObject,
	useProfileContext: boolean,
	nextValues: unknown[],
): Promise<IDataObject | IDataObject[]> {
	const effectiveProfileSelector = getEffectiveProfileSelector(fieldContext, profileSelector);

	if (useProfileContext) {
		const updateBody: IDataObject = {
			fieldKey: customFieldKey,
			fieldValue: nextValues,
			...effectiveProfileSelector,
		};

		return await lsRequest.call(ctx, 'PUT', `/custom-fields/store/${userId}/profiles/by-card/${fieldContext.cardId}`, {
			body: updateBody,
		});
	}

	return await lsRequest.call(ctx, 'PUT', `/custom-fields/store/${userId}/fields/${customFieldKey}`, {
		body: { fieldValue: nextValues },
	});
}

function readTypedFieldValue(ctx: ExecuteContext, i: number, fieldType: string): unknown {
	switch (fieldType) {
		case 'string':
			return ctx.getNodeParameter('fieldValueString', i) as string;
		case 'number':
			return ctx.getNodeParameter('fieldValueNumber', i) as number;
		case 'boolean':
			return ctx.getNodeParameter('fieldValueBoolean', i) as boolean;
		case 'dateTime':
			return ctx.getNodeParameter('fieldValueDateTime', i) as string;
		case 'option': {
			const singleOption = ctx.getNodeParameter('fieldValueOption', i) as string;
			return [singleOption];
		}
		case 'multiOptions':
			return ctx.getNodeParameter('fieldValueMultiOptions', i) as string[];
		case 'files':
		case 'images':
		case 'videos':
		case 'audios':
			return ctx.getNodeParameter('fieldValueBinary', i, 'data') as string;
		default:
			return ctx.getNodeParameter('fieldValueFallback', i, '') as string;
	}
}

const getCards: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	return await lsRequest.call(ctx, 'GET', '/custom-fields/cards', { qs: { limit, offset } });
};

const getCardsExpanded: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	return await lsRequest.call(ctx, 'GET', '/custom-fields/cards/expanded', { qs: { limit, offset } });
};

const getDefinitions: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	const customFieldCardId = ctx.getNodeParameter('customFieldCardId', i, undefined);

	const qs: IDataObject = { limit, offset };
	if (customFieldCardId) qs.customFieldCardId = customFieldCardId;

	return await lsRequest.call(ctx, 'GET', '/custom-fields/definitions', { qs });
};

const getCategories: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	const customFieldCardId = ctx.getNodeParameter('customFieldCardId', i, undefined);

	const qs: IDataObject = { limit, offset };
	if (customFieldCardId) qs.customFieldCardId = customFieldCardId;

	return await lsRequest.call(ctx, 'GET', '/custom-fields/categories', { qs });
};

const getStore: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}`);
};

const getStoreValues: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const profileIndex = normalizeProfileIndex(ctx.getNodeParameter('profileIndex', i, ''));

	const qs: IDataObject = {};
	if (profileIndex !== undefined) {
		qs.profileIndex = profileIndex;
	}

	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}/values`, { qs });
};

const getFieldValues: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const fieldKey = ctx.getNodeParameter('fieldKey', i) as string;
	const response = await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}/fields/${fieldKey}`);
	return normalizeCustomFieldValue(response);
};

const setFieldValue: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const fieldKey = ctx.getNodeParameter('fieldKey', i) as string;
	const fieldType = ctx.getNodeParameter('fieldType', i, '') as string;

	let fieldValue: unknown;
	let fileFieldContext: PublicUrlFileFieldContext | undefined;
	let fileProfileSelector: IDataObject | undefined;
	let useFileProfileContext = false;

	if (FILE_FIELD_TYPES.has(fieldType)) {
		const binaryPropertyNames = readTypedFieldValue(ctx, i, fieldType) as string;
		const fileNameOverride = (ctx.getNodeParameter('fieldValueFileName', i, '') as string).trim() || undefined;
		const fileValueMode = getFileValueMode(ctx, i);
		fileFieldContext = await getPublicUrlFileFieldContext(ctx, fieldKey);
		fileProfileSelector = buildProfileSelector(ctx, i);
		const { existingValues, useProfileContext } = await readExistingFileValues(
			ctx,
			userId,
			fieldKey,
			fileFieldContext,
			fileProfileSelector,
		);
		useFileProfileContext = useProfileContext;

		const uploadCount = countBinaryPropertyNames(binaryPropertyNames);
		if (fileValueMode !== 'replaceIfFull') {
			const expectedValues = fileValueMode === 'replace' ? uploadCount : existingValues.length + uploadCount;
			assertFileValueCountWithinLimit(ctx, fieldKey, expectedValues, fileFieldContext.maxItems);
		}

		const uploadedValues = await uploadFilesFromBinaryProperties(
			ctx,
			i,
			userId,
			fieldKey,
			binaryPropertyNames,
			fieldType,
			fileNameOverride,
		);
		fieldValue = buildNextFileValues(
			ctx,
			fieldKey,
			existingValues,
			uploadedValues,
			fileFieldContext.maxItems,
			fileValueMode,
		);
	} else {
		fieldValue = readTypedFieldValue(ctx, i, fieldType);
	}

	if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
		throw new NodeOperationError(ctx.getNode(), `No value provided for custom field "${fieldKey}".`);
	}

	const profileId = ctx.getNodeParameter('profileId', i, '') as string;
	const validProfileIndex = normalizeProfileIndex(ctx.getNodeParameter('profileIndex', i, ''));

	const body: IDataObject = { fieldValue };
	if (profileId) {
		body.profileId = profileId;
	} else if (validProfileIndex !== undefined) {
		body.profileIndex = validProfileIndex;
	}

	if (fileFieldContext && fileProfileSelector) {
		const response = await writeFileValues(
			ctx,
			userId,
			fieldKey,
			fileFieldContext,
			fileProfileSelector,
			useFileProfileContext,
			fieldValue as unknown[],
		);
		return normalizeCustomFieldValue(response);
	}

	const response = await lsRequest.call(ctx, 'PUT', `/custom-fields/store/${userId}/fields/${fieldKey}`, { body });
	return normalizeCustomFieldValue(response);
};

function buildFieldTypeMap(
	cards: Array<{
		definitions?: Array<{
			key?: string;
			typeDefinition?: { type?: string };
		}>;
	}>,
): Map<string, LsType> {
	const typeMap = new Map<string, LsType>();

	for (const card of cards) {
		if (!Array.isArray(card?.definitions)) continue;
		for (const def of card.definitions) {
			if (def?.key && def?.typeDefinition?.type) {
				typeMap.set(def.key, def.typeDefinition.type as LsType);
			}
		}
	}

	return typeMap;
}

const setMultipleFieldValues: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const profileId = ctx.getNodeParameter('profileId', i, '') as string;
	const validProfileIndex = normalizeProfileIndex(ctx.getNodeParameter('profileIndex', i, ''));
	const fileValueMode = getFileValueMode(ctx, i);

	const mapperData = ctx.getNodeParameter('fieldValues', i) as { value?: Record<string, unknown> };
	const fieldMappings = mapperData?.value || {};

	const cardsResponse = await lsRequest.call(ctx, 'GET', '/custom-fields/cards/expanded');

	if (!Array.isArray(cardsResponse)) {
		throw new NodeOperationError(ctx.getNode(), 'Failed to load custom field definitions.');
	}

	const cards = cardsResponse as Array<{
		definitions?: Array<{
			key?: string;
			typeDefinition?: { type?: string };
		}>;
	}>;
	const expandedCards = cardsResponse as ExpandedCustomFieldCard[];

	const fieldTypeMap = buildFieldTypeMap(cards);

	const entries = Object.entries(fieldMappings).filter(([, value]) => value !== undefined);
	const payload: IDataObject[] = [];

	for (const [fieldKey, value] of entries) {
		const lsType = fieldTypeMap.get(fieldKey);

		if (!lsType) {
			throw new NodeOperationError(ctx.getNode(), `Unknown custom field "${fieldKey}".`);
		}

		let fieldValue: unknown;

		if (FILE_FIELD_TYPES.has(lsType)) {
			const binaryPropertyNames = typeof value === 'string' ? value : 'data';
			const fieldContext = findFileFieldContext(ctx, expandedCards, fieldKey);
			const profileSelector: IDataObject = {};
			if (profileId) {
				profileSelector.profileId = profileId;
			} else if (validProfileIndex !== undefined) {
				profileSelector.profileIndex = validProfileIndex;
			}
			const { existingValues } = await readExistingFileValues(ctx, userId, fieldKey, fieldContext, profileSelector);
			const uploadCount = countBinaryPropertyNames(binaryPropertyNames);

			if (fileValueMode !== 'replaceIfFull') {
				const expectedValues = fileValueMode === 'replace' ? uploadCount : existingValues.length + uploadCount;
				assertFileValueCountWithinLimit(ctx, fieldKey, expectedValues, fieldContext.maxItems);
			}

			const uploadedValues = await uploadFilesFromBinaryProperties(
				ctx,
				i,
				userId,
				fieldKey,
				binaryPropertyNames,
				lsType,
			);
			fieldValue = buildNextFileValues(
				ctx,
				fieldKey,
				existingValues,
				uploadedValues,
				fieldContext.maxItems,
				fileValueMode,
			);
		} else {
			fieldValue = normalizeSingleFieldValueOrFail(ctx, value, fieldKey, lsType);
		}

		const entry: IDataObject = { fieldKey, fieldValue: fieldValue as IDataObject };

		if (profileId) {
			entry.profileId = profileId;
		} else if (validProfileIndex !== undefined) {
			entry.profileIndex = validProfileIndex;
		}

		payload.push(entry);
	}

	if (!payload.length) {
		return [];
	}

	return await lsRequest.call(ctx, 'PUT', `/custom-fields/store/${userId}/fields`, {
		body: payload as unknown as IDataObject,
	});
};

const createFileUploadTarget: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const customFieldKey = (
		(ctx.getNodeParameter('customFieldKey', i, '') as string) || (ctx.getNodeParameter('fieldKey', i, '') as string)
	).trim();
	const fileName = (ctx.getNodeParameter('customFieldFileName', i, '') as string).trim();
	const publicDownloadUrl = (ctx.getNodeParameter('publicDownloadUrl', i, '') as string).trim();
	const profileSelector = buildProfileSelector(ctx, i);
	const fileValueMode = getFileValueMode(ctx, i);

	if (!customFieldKey) {
		throw new NodeOperationError(ctx.getNode(), 'No custom field key provided.');
	}

	if (!publicDownloadUrl) {
		throw new NodeOperationError(ctx.getNode(), 'No public download URL provided.');
	}

	const fieldContext = await getPublicUrlFileFieldContext(ctx, customFieldKey);
	const { existingValues, useProfileContext } = await readExistingFileValues(
		ctx,
		userId,
		customFieldKey,
		fieldContext,
		profileSelector,
	);

	const body: IDataObject = { customFieldKey };

	if (fileName) {
		body.fileName = fileName;
	}

	body.publicDownloadUrl = publicDownloadUrl;

	const createFileResponse = (await lsRequest.call(ctx, 'POST', `/custom-fields/store/${userId}/files`, {
		body,
	})) as IDataObject;
	const customFieldValue = createFileResponse.customFieldValue;

	if (customFieldValue === undefined || customFieldValue === null) {
		throw new NodeOperationError(
			ctx.getNode(),
			'LearningSuite did not return a custom field value for the uploaded file.',
		);
	}

	const uploadedValues = normalizeValuesArray(customFieldValue);
	const nextValues = buildNextFileValues(
		ctx,
		customFieldKey,
		existingValues,
		uploadedValues,
		fieldContext.maxItems,
		fileValueMode,
	);

	return await writeFileValues(
		ctx,
		userId,
		customFieldKey,
		fieldContext,
		profileSelector,
		useProfileContext,
		nextValues,
	);
};

const getProfiles: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const customFieldCardId = ctx.getNodeParameter('customFieldCardId', i, undefined);

	const qs: IDataObject = {};
	if (customFieldCardId) qs.customFieldCardId = customFieldCardId;

	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}/profiles`, { qs });
};

const getProfilesExpanded: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const customFieldCardId = ctx.getNodeParameter('customFieldCardId', i, undefined);

	const qs: IDataObject = {};
	if (customFieldCardId) qs.customFieldCardId = customFieldCardId;

	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}/profiles/expanded`, { qs });
};

const getProfileByCard: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const cardId = ctx.getNodeParameter('customFieldCardId', i) as string;

	const profileId = ctx.getNodeParameter('profileId', i, '') as string;
	const profileIndex = normalizeProfileIndex(ctx.getNodeParameter('profileIndex', i, ''));
	const profileName = ctx.getNodeParameter('profileName', i, '');

	const qs: IDataObject = {};
	if (profileId) {
		qs.profileId = profileId;
	} else if (profileIndex !== undefined) {
		qs.profileIndex = profileIndex;
	} else if (profileName) {
		qs.profileName = profileName;
	}

	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}/profiles/by-card/${cardId}`, { qs });
};

const updateProfileField: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const cardId = ctx.getNodeParameter('customFieldCardId', i) as string;
	const fieldKey = ctx.getNodeParameter('fieldKey', i) as string;
	const fieldType = ctx.getNodeParameter('fieldType', i, '') as string;

	let fieldValue: unknown;
	let fileFieldContext: PublicUrlFileFieldContext | undefined;
	let fileProfileSelector: IDataObject | undefined;

	if (FILE_FIELD_TYPES.has(fieldType)) {
		const binaryPropertyNames = readTypedFieldValue(ctx, i, fieldType) as string;
		const fileNameOverride = (ctx.getNodeParameter('fieldValueFileName', i, '') as string).trim() || undefined;
		const fileValueMode = getFileValueMode(ctx, i);
		fileFieldContext = await getPublicUrlFileFieldContext(ctx, fieldKey);
		fileProfileSelector = getEffectiveProfileSelector(fileFieldContext, buildProfileSelector(ctx, i));
		const { existingValues } = await readExistingFileValues(
			ctx,
			userId,
			fieldKey,
			fileFieldContext,
			fileProfileSelector,
			true,
		);
		const uploadCount = countBinaryPropertyNames(binaryPropertyNames);

		if (fileValueMode !== 'replaceIfFull') {
			const expectedValues = fileValueMode === 'replace' ? uploadCount : existingValues.length + uploadCount;
			assertFileValueCountWithinLimit(ctx, fieldKey, expectedValues, fileFieldContext.maxItems);
		}

		const uploadedValues = await uploadFilesFromBinaryProperties(
			ctx,
			i,
			userId,
			fieldKey,
			binaryPropertyNames,
			fieldType,
			fileNameOverride,
		);
		fieldValue = buildNextFileValues(
			ctx,
			fieldKey,
			existingValues,
			uploadedValues,
			fileFieldContext.maxItems,
			fileValueMode,
		);
	} else {
		fieldValue = readTypedFieldValue(ctx, i, fieldType);
	}

	if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
		throw new NodeOperationError(ctx.getNode(), `No value provided for custom field "${fieldKey}".`);
	}

	const body: IDataObject = { fieldKey, fieldValue };
	let profileSelector = buildProfileSelector(ctx, i);

	if (fileFieldContext) {
		profileSelector = getEffectiveProfileSelector(fileFieldContext, profileSelector);
	} else if (!(await cardAllowsMultipleProfiles(ctx, cardId))) {
		profileSelector = {};
	}

	if (profileSelector.profileId !== undefined) {
		body.profileId = profileSelector.profileId;
	} else if (profileSelector.profileIndex !== undefined) {
		body.profileIndex = profileSelector.profileIndex;
	} else if (profileSelector.profileName !== undefined) {
		body.profileName = profileSelector.profileName;
	}

	const response = await lsRequest.call(ctx, 'PUT', `/custom-fields/store/${userId}/profiles/by-card/${cardId}`, {
		body,
	});
	return normalizeCustomFieldValue(response);
};

export const customFieldsHandlers = {
	getCards,
	getCardsExpanded,
	getDefinitions,
	getCategories,
	getStore,
	getStoreValues,
	getFieldValues,
	setFieldValue,
	setMultipleFieldValues,
	createFileUploadTarget,
	getProfiles,
	getProfilesExpanded,
	getProfileByCard,
	updateProfileField,
};
