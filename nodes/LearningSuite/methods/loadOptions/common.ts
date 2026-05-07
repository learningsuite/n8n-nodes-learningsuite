import type { ILoadOptionsFunctions, IDataObject, INodePropertyOptions } from 'n8n-workflow';
import { lsRequest, lsRequestAll } from '../../shared';

export type Option = INodePropertyOptions;
type LoadOptionRow = IDataObject;

export function toOptions(
	rows: LoadOptionRow[],
	labelKeys: string[] = ['name', 'title', 'email'],
	valueKeys: string[] = ['id', 'sid', 'slug'],
): INodePropertyOptions[] {
	return rows.map((r) => {
		const label = labelKeys.map((k) => r?.[k]).find((v) => v) ?? r?.id ?? r?.sid ?? r?.slug ?? 'Unknown';
		const value = valueKeys.map((k) => r?.[k]).find((v) => v) ?? label;
		return { name: String(label), value: String(value) };
	});
}

export function ensureArray<T>(res: T | T[]): T[] {
	return Array.isArray(res) ? res : [res];
}

export async function fetchOptions(
	this: ILoadOptionsFunctions,
	endpoint: string,
	qs?: IDataObject,
	labelKeys?: string[],
	valueKeys?: string[],
): Promise<INodePropertyOptions[]> {
	const res = await lsRequest.call(this, 'GET', endpoint, { qs });
	const rows = ensureArray(res) as LoadOptionRow[];
	return toOptions(rows, labelKeys, valueKeys);
}

export async function fetchOptionsAll(
	this: ILoadOptionsFunctions,
	endpoint: string,
	qs?: IDataObject,
	labelKeys?: string[],
	valueKeys?: string[],
): Promise<INodePropertyOptions[]> {
	const rows = await lsRequestAll.call(this, endpoint, { qs });
	return toOptions(rows as LoadOptionRow[], labelKeys, valueKeys);
}
