// n8n-nodes-learningsuite/nodes/LearningSuite/methods/loadOptions/customFields.helpers.ts

import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { lsRequestAll } from './request';
import type { LsFieldDefinition } from './customFields.shared';
import { isLsCard, isLsFieldDefinition } from './customFields.shared';

export async function fetchFieldDefinition(
	ctx: ILoadOptionsFunctions,
	fieldKey: string,
): Promise<LsFieldDefinition | undefined> {
	const cards = await lsRequestAll.call(ctx, '/custom-fields/cards/expanded');

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

export function getLsSimpleType(def: LsFieldDefinition): string {
	const td = def?.typeDefinition;
	if (!td) {
		return 'string';
	}

	const type = String(td.type ?? '').toLowerCase();
	const variant = String(td.variant ?? '').toLowerCase();

	switch (type) {
		case 'string':
			return 'string';
		case 'number':
			return 'number';
		case 'boolean':
			return 'boolean';
		case 'datetime':
		case 'date':
		case 'time':
			return 'dateTime';
		case 'select':
			return variant === 'multi' ? 'multiOptions' : 'option';
		case 'files':
			return 'files';
		case 'images':
			return 'images';
		case 'videos':
			return 'videos';
		case 'audios':
			return 'audios';
		default:
			return 'string';
	}
}
