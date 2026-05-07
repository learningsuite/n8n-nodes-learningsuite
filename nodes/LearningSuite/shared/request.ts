import {
	ApplicationError,
	NodeApiError,
	NodeOperationError,
	type IDataObject,
	type IHttpRequestOptions,
	type JsonObject,
	type IExecuteFunctions,
	type IHookFunctions,
	type ILoadOptionsFunctions,
	type IWebhookFunctions,
	type ITriggerFunctions,
	type IPollFunctions,
} from 'n8n-workflow';

export type ApiThis =
	| IExecuteFunctions
	| ILoadOptionsFunctions
	| IHookFunctions
	| IWebhookFunctions
	| ITriggerFunctions
	| IPollFunctions;

type RequestWithAuthentication = (credentialType: string, options: IDataObject) => Promise<IDataObject | IDataObject[]>;

function hasRequestWithAuthentication(value: ApiThis): value is ApiThis & {
	helpers: {
		httpRequestWithAuthentication: RequestWithAuthentication;
	};
} {
	return (
		typeof value === 'object' && value !== null && typeof value.helpers?.httpRequestWithAuthentication === 'function'
	);
}

export function normalizeEndpoint(endpoint: string): string {
	if (!endpoint) throw new ApplicationError('Missing endpoint');
	if (/^https?:\/\//i.test(endpoint)) {
		throw new ApplicationError('Endpoint must be a relative path (e.g. "/members").');
	}
	return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

async function requestCore(
	this: ApiThis,
	{
		method,
		endpoint,
		qs,
		body,
	}: {
		method: IHttpRequestOptions['method'];
		endpoint: string;
		qs?: IDataObject;
		body?: IDataObject;
	},
): Promise<IDataObject | IDataObject[]> {
	const url = normalizeEndpoint(endpoint);

	const creds = (await this.getCredentials('learningSuiteApi')) as IDataObject;
	const baseURL = String(creds.baseUrl || '').trim();
	if (!/^https?:\/\//i.test(baseURL)) {
		throw new NodeOperationError(this.getNode(), 'Invalid Base URL in credentials');
	}

	const options: IDataObject = {
		method,
		baseURL,
		url,
		json: true,
	};

	if (qs && Object.keys(qs).length) options.qs = qs as JsonObject;
	if (body && Object.keys(body).length && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(String(method).toUpperCase())) {
		options.body = body as JsonObject;
	}

	try {
		if (!hasRequestWithAuthentication(this)) throw new ApplicationError('No HTTP helper available');

		return await this.helpers.httpRequestWithAuthentication.call(this, 'learningSuiteApi', options);
	} catch (error) {
		if (error instanceof NodeApiError) throw error;
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function lsRequest(
	this: ApiThis,
	method: IHttpRequestOptions['method'],
	endpoint: string,
	{ qs, body }: { qs?: IDataObject; body?: IDataObject } = {},
): Promise<IDataObject | IDataObject[]> {
	return requestCore.call(this, { method, endpoint, qs, body });
}

export async function apiRequest(
	this: ApiThis,
	{
		method,
		path,
		qs,
		body,
	}: {
		method: IHttpRequestOptions['method'];
		path: string;
		qs?: IDataObject;
		body?: IDataObject;
	},
): Promise<IDataObject | IDataObject[]> {
	return requestCore.call(this, { method, endpoint: path, qs, body });
}

export async function lsRequestAll(
	this: ApiThis,
	endpoint: string,
	{ qs }: { qs?: IDataObject } = {},
): Promise<IDataObject[]> {
	const pageSize = 100;
	const maxPages = 500;
	const all: IDataObject[] = [];
	let offset = 0;

	for (let page = 0; page < maxPages; page++) {
		const res = await lsRequest.call(this, 'GET', endpoint, {
			qs: { ...(qs ?? {}), limit: pageSize, offset },
		});
		const rows = Array.isArray(res) ? res : res ? [res] : [];
		all.push(...(rows as IDataObject[]));

		if (rows.length < pageSize) break;
		offset += pageSize;
	}

	return all;
}
