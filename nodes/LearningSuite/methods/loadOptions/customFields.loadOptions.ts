import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { fetchOptionsAll } from './common';
import { lsRequestAll } from '../../shared';
import { fetchFieldDefinition, getLsSimpleType } from '../../shared/customFields.helpers';

const MEDIA_FIELD_TYPES = new Set(['files', 'images', 'videos', 'audios']);

function getMediaFieldMaxInfo(fieldType: string, typeDefinition?: Record<string, unknown>): string | undefined {
	const maxByType: Record<string, unknown> = {
		files: typeDefinition?.maxFiles,
		images: typeDefinition?.maxImages,
		videos: typeDefinition?.maxVideos,
		audios: typeDefinition?.maxAudios,
	};

	const max = maxByType[fieldType];

	if (typeof max === 'number' && Number.isFinite(max)) {
		return `max. ${max}`;
	}

	if (typeof max === 'string' && max.trim() !== '') {
		return `max. ${max.trim()}`;
	}

	return undefined;
}

function getMediaFieldDetails(fieldType: string, typeDefinition?: Record<string, unknown>, cardName?: string): string {
	const typeLabel = fieldType.charAt(0).toUpperCase() + fieldType.slice(1);
	return [typeLabel, getMediaFieldMaxInfo(fieldType, typeDefinition), cardName].filter(Boolean).join(', ');
}

export async function customFields_getCards(this: ILoadOptionsFunctions) {
	return fetchOptionsAll.call(this, '/custom-fields/cards', undefined, ['name', 'title'], ['id']);
}

export async function customFields_getDefinitions(this: ILoadOptionsFunctions) {
	const cardId = this.getCurrentNodeParameter('cardId') as string | undefined;
	const customFieldCardId = this.getCurrentNodeParameter('customFieldCardId') as string | undefined;

	const filterCardId = cardId || customFieldCardId;

	const definitions = await lsRequestAll.call(this, '/custom-fields/definitions', {
		qs: filterCardId ? { customFieldCardId: filterCardId } : undefined,
	});

	return definitions
		.filter((definition) => typeof definition === 'object' && definition !== null)
		.map((definition) => {
			const definitionRecord = definition as Record<string, unknown>;
			const key = definitionRecord.key;
			const typeDefinition = definitionRecord.typeDefinition as Record<string, unknown> | undefined;
			const fieldType = String(typeDefinition?.type ?? '').toLowerCase();
			const fieldName = String(definitionRecord.label ?? definitionRecord.name ?? key ?? 'Unknown');
			const value = String(key ?? fieldName);

			if (!MEDIA_FIELD_TYPES.has(fieldType)) {
				return { name: fieldName, value };
			}

			return {
				name: `${fieldName} (${getMediaFieldDetails(fieldType, typeDefinition)})`,
				value,
			};
		});
}

export async function customFields_getMediaDefinitions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const cards = await lsRequestAll.call(this, '/custom-fields/cards/expanded');

	const options: INodePropertyOptions[] = [];

	for (const card of cards) {
		if (typeof card !== 'object' || card === null) continue;

		const cardRecord = card as Record<string, unknown>;
		const definitions = cardRecord.definitions;
		if (!Array.isArray(definitions)) continue;

		const cardName = String(cardRecord.name ?? cardRecord.title ?? '').trim();

		for (const definition of definitions) {
			if (typeof definition !== 'object' || definition === null) continue;

			const definitionRecord = definition as Record<string, unknown>;
			const key = definitionRecord.key;
			const typeDefinition = definitionRecord.typeDefinition as Record<string, unknown> | undefined;
			const fieldType = String(typeDefinition?.type ?? '').toLowerCase();

			if (typeof key !== 'string' || !MEDIA_FIELD_TYPES.has(fieldType)) {
				continue;
			}

			const fieldName = String(definitionRecord.label ?? definitionRecord.name ?? key);
			const details = getMediaFieldDetails(fieldType, typeDefinition, cardName);
			const name = `${fieldName} (${details})`;

			options.push({ name, value: key });
		}
	}

	return options.sort((a, b) => String(a.name).localeCompare(String(b.name)));
}

export async function customFields_getCategories(this: ILoadOptionsFunctions) {
	const customFieldCardId = this.getCurrentNodeParameter('customFieldCardId') as string | undefined;

	return fetchOptionsAll.call(
		this,
		'/custom-fields/categories',
		customFieldCardId ? { customFieldCardId } : undefined,
		['name', 'title'],
		['id'],
	);
}

export async function customFields_getFieldType(this: ILoadOptionsFunctions) {
	const fieldKey = this.getCurrentNodeParameter('fieldKey') as string | undefined;

	if (!fieldKey) {
		return [{ name: 'Unknown', value: '' }];
	}

	const definition = await fetchFieldDefinition(this, fieldKey);

	if (!definition) {
		return [{ name: 'Unknown', value: '' }];
	}

	const simpleType = getLsSimpleType(definition);

	return [{ name: simpleType, value: simpleType }];
}

export async function customFields_getFieldOptions(this: ILoadOptionsFunctions) {
	const fieldKey = this.getCurrentNodeParameter('fieldKey') as string | undefined;

	if (!fieldKey) {
		return [];
	}

	const definition = await fetchFieldDefinition(this, fieldKey);

	if (!definition?.typeDefinition?.options) {
		return [];
	}

	const options = definition.typeDefinition.options;

	return options
		.filter((opt) => opt && opt.key)
		.map((opt) => ({
			name: String(opt.label ?? opt.key),
			value: String(opt.key),
		}));
}
