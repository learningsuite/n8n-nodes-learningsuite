// n8n-nodes-learningsuite/nodes/LearningSuite/shared/customFields.shared.ts

import type { FieldType } from 'n8n-workflow';

export interface LsOption {
	key: string;
	label?: string;
}

export interface LsTypeDefinition {
	type?: string;
	variant?: string;
	options?: LsOption[];
	maxFiles?: number;
	maxImages?: number;
	maxVideos?: number;
	maxAudios?: number;
}

export interface LsFieldDefinition {
	key: string;
	name: string;
	customFieldCardId?: string;
	typeDefinition?: LsTypeDefinition;
}

export interface LsCard {
	definitions?: LsFieldDefinition[];
}

export interface MappedTypeResult {
	type: FieldType;
	options?: Array<{ name: string; value: string }>;
	maxInfo?: string;
}

export const SIMPLE_TYPE_MAPPING: Record<string, FieldType> = {
	string: 'string',
	number: 'number',
	boolean: 'boolean',
	datetime: 'dateTime',
};

export const MEDIA_TYPES = ['files', 'images', 'videos', 'audios'] as const;

export function isLsCard(value: unknown): value is LsCard {
	return typeof value === 'object' && value !== null;
}

export function isLsFieldDefinition(value: unknown): value is LsFieldDefinition {
	if (typeof value !== 'object' || value === null || !('key' in value)) {
		return false;
	}

	const candidate = value as Record<string, unknown>;
	return typeof candidate.key === 'string';
}

export function toOptions(def: LsFieldDefinition): Array<{ name: string; value: string }> | undefined {
	const opts = def?.typeDefinition?.options;
	if (!Array.isArray(opts) || opts.length === 0) {
		return undefined;
	}

	const validOptions = opts
		.filter((o): o is LsOption => Boolean(o && o.key !== undefined))
		.map((o) => ({
			name: String(o.label ?? o.key),
			value: String(o.key),
		}));

	return validOptions.length > 0 ? validOptions : undefined;
}

export function mapLsType(def: LsFieldDefinition): MappedTypeResult {
	const td = def?.typeDefinition;
	if (!td) {
		return { type: 'string' };
	}

	const typeRaw = String(td.type ?? '').toLowerCase();
	const variantRaw = String(td.variant ?? '').toLowerCase();

	if (typeRaw === 'select') {
		const options = toOptions(def);

		if (variantRaw === 'multi') {
			return { type: 'array', options };
		}

		return { type: 'options', options };
	}

	if ((MEDIA_TYPES as readonly string[]).includes(typeRaw)) {
		const max = td.maxFiles ?? td.maxImages ?? td.maxVideos ?? td.maxAudios;

		return {
			type: 'string',
			maxInfo: typeof max === 'number' ? `max. ${max}` : undefined,
		};
	}

	if (typeRaw in SIMPLE_TYPE_MAPPING) {
		return { type: SIMPLE_TYPE_MAPPING[typeRaw] };
	}

	return { type: 'string' };
}

export function isValidFieldKey(fieldKey: string | undefined): fieldKey is string {
	return Boolean(fieldKey && fieldKey.trim() !== '');
}

export function findFieldDefinition(cards: unknown[], fieldKey: string): LsFieldDefinition | undefined {
	for (const card of cards) {
		if (!isLsCard(card) || !Array.isArray(card.definitions)) {
			continue;
		}

		const found = card.definitions.find((d): d is LsFieldDefinition => isLsFieldDefinition(d) && d.key === fieldKey);

		if (found) {
			return found;
		}
	}

	return undefined;
}

export function collectAllFieldDefinitions(cards: unknown[]): LsFieldDefinition[] {
	const fields: LsFieldDefinition[] = [];

	for (const card of cards) {
		if (!isLsCard(card) || !Array.isArray(card.definitions)) {
			continue;
		}

		for (const def of card.definitions) {
			if (isLsFieldDefinition(def) && def.typeDefinition) {
				fields.push(def);
			}
		}
	}

	return fields;
}
