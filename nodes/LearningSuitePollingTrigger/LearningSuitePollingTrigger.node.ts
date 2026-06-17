// n8n-nodes-learningsuite/nodes/LearningSuitePollingTrigger/LearningSuitePollingTrigger.node.ts
import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	type IPollFunctions,
	type INodeExecutionData,
	type IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

import { apiRequest } from '../LearningSuite/shared/request';
import { properties as pollingProperties } from './descriptions/trigger.polling.properties';
import * as loCommunity from '../LearningSuite/methods/loadOptions/community.loadOptions';

const TIMELINE_EVENTS = new Set<string>([
	'bundle.created',
	'customField.card.created',
	'customPopup.created',
	'group.created',
	'community.area.created',
	'community.badge.created',
	'community.forum.created',
	'member.created',
	'teamMember.created',
	'teamMember.updated',
]);

type PollableRecord = IDataObject & {
	id?: string | number;
	areaId?: string | number;
	lastLogin?: string;
	createdAt?: string;
	updatedAt?: string;
};

type PaginatedResponse = {
	items?: PollableRecord[];
	data?: PollableRecord[];
};

function asPollableRecord(value: unknown): PollableRecord | null {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return null;
	}

	return value as PollableRecord;
}

function extractItems(res: unknown): PollableRecord[] {
	if (Array.isArray(res)) return res.map(asPollableRecord).filter((item): item is PollableRecord => item !== null);

	if (typeof res === 'object' && res !== null) {
		const paginated = res as PaginatedResponse;
		if (Array.isArray(paginated.items)) return paginated.items;
		if (Array.isArray(paginated.data)) return paginated.data;
	}

	return [];
}

function isDateComparable(value: unknown): value is string | number | Date {
	return typeof value === 'string' || typeof value === 'number' || value instanceof Date;
}

async function fetchInactiveMembers(
	self: IPollFunctions,
	{
		days,
		includeNever,
		limit = 100,
		maxPages = 50,
	}: {
		days: number;
		includeNever: boolean;
		limit?: number;
		maxPages?: number;
	},
): Promise<IDataObject[]> {
	let offset = 0;
	const out: IDataObject[] = [];

	for (let page = 0; page < maxPages; page++) {
		const qs: IDataObject = {
			limit,
			offset,
			days_not_logged_in_gte: days,
			include_never_logged_in: includeNever,
		};

		const res = await apiRequest.call(self, {
			method: 'GET',
			path: '/members',
			qs,
		});

		const items = extractItems(res);
		if (!items.length) break;

		out.push(...(items as IDataObject[]));
		if (items.length < limit) break;

		offset += limit;
	}

	return out;
}

async function pollFetchCreatedSince(
	self: IPollFunctions,
	path: string,
	sinceIso: string,
	{
		limit = 50,
		createdKey = 'createdAt',
		updatedKey = 'updatedAt',
		compareOn = 'createdAt',
		qs: extraQs = {},
		maxPages = 20,
	}: {
		limit?: number;
		createdKey?: string;
		updatedKey?: string;
		compareOn?: 'createdAt' | 'updatedAt';
		qs?: IDataObject;
		maxPages?: number;
	} = {},
): Promise<IDataObject[]> {
	let offset = 0;
	const out: IDataObject[] = [];
	const seenIds = new Set<string>();

	const sinceTs = new Date(sinceIso).getTime();

	for (let page = 0; page < maxPages; page++) {
		const qs: IDataObject = {
			limit,
			offset,
			...extraQs,
		};

		const res = await apiRequest.call(self, {
			method: 'GET',
			path,
			qs,
		});

		const rows = extractItems(res);
		if (!rows.length) break;

		for (const row of rows) {
			const id = String(row?.id ?? '');
			if (!id || seenIds.has(id)) continue;
			seenIds.add(id);

			const ts =
				compareOn === 'createdAt' ? (row?.[createdKey] ?? row?.[updatedKey]) : (row?.[updatedKey] ?? row?.[createdKey]);

			if (!isDateComparable(ts)) {
				out.push(row as IDataObject);
				continue;
			}

			if (new Date(ts).getTime() > sinceTs) {
				out.push(row as IDataObject);
			}
		}

		if (rows.length < limit) break;

		offset += limit;
	}

	return out;
}

export class LearningSuitePollingTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LearningSuite Polling Trigger',
		name: 'learningSuitePollingTrigger',
		icon: {
			light: 'file:../LearningSuite/icons/learningsuite-icon-light.svg',
			dark: 'file:../LearningSuite/icons/learningsuite-icon-dark.svg',
		},
		group: ['trigger', 'schedule'],
		version: 1,
		polling: true,
		description: 'Polling Trigger node for LearningSuite API (powered by joergsebening.de)',
		subtitle: '={{$parameter["event"]}}',
		defaults: {
			name: 'LearningSuite Polling Trigger',
			// @ts-expect-error -- description is required by n8n node linting for defaults
			description: 'Polling Trigger node for LearningSuite API (powered by joergsebening.de)',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'learningSuiteApi', required: true }],
		properties: pollingProperties,
	};

	methods = {
		loadOptions: {
			community_getAreas: loCommunity.community_getAreas,
		},
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const event = this.getNodeParameter('event', 0) as string;
		const store = this.getWorkflowStaticData('node') as IDataObject;

		let items: IDataObject[] = [];

		if (TIMELINE_EVENTS.has(event)) {
			const cursorMap = (store.lastTimeCheckedMap as IDataObject) || {};
			const lastIso = (cursorMap[event] as string) || new Date(0).toISOString();

			switch (event) {
				case 'bundle.created':
					items = await pollFetchCreatedSince(this, '/bundles', lastIso);
					break;

				case 'customPopup.created':
					items = await pollFetchCreatedSince(this, '/popups', lastIso);
					break;

				case 'customField.card.created':
					items = await pollFetchCreatedSince(this, '/custom-fields/cards', lastIso, {
						limit: 100,
					});
					break;

				case 'group.created':
					items = await pollFetchCreatedSince(this, '/groups', lastIso, {
						qs: {
							includeUsers: false,
						},
					});
					break;

				case 'community.area.created':
					items = await pollFetchCreatedSince(this, '/community/areas', lastIso);
					break;

				case 'community.badge.created':
					items = await pollFetchCreatedSince(this, '/community/badges', lastIso);
					break;

				case 'community.forum.created': {
					const rawAreaId = this.getNodeParameter('additionalCommunityForum.areaId', 0) as string | undefined;
					const areaId = typeof rawAreaId === 'string' ? rawAreaId.trim() : '';

					const all = await pollFetchCreatedSince(this, '/community/forums', lastIso);
					items = areaId ? all.filter((forum) => String(forum.areaId ?? '') === areaId) : all;
					break;
				}

				case 'member.created':
					items = await pollFetchCreatedSince(this, '/members', lastIso);
					break;

				case 'teamMember.created':
					items = await pollFetchCreatedSince(this, '/team-members', lastIso, {
						compareOn: 'createdAt',
					});
					break;

				case 'teamMember.updated':
					items = await pollFetchCreatedSince(this, '/team-members', lastIso, {
						compareOn: 'updatedAt',
					});
					break;

				default:
					items = [];
			}

			if (items.length) {
				cursorMap[event] = new Date().toISOString();
				store.lastTimeCheckedMap = cursorMap;
			}
		}

		if (event === 'member.inactiveForXDays') {
			const days = this.getNodeParameter('inactiveDays', 0) as number;
			const includeNever = this.getNodeParameter('includeNeverLoggedIn', 0) as boolean;
			const triggerMode = this.getNodeParameter('inactiveTriggerMode', 0) as 'once' | 'recurring';

			if (!Number.isFinite(days) || days < 1) {
				throw new NodeOperationError(this.getNode(), 'Inactive days must be greater than 0');
			}

			const limit = this.getNodeParameter('memberLimit', 0) as number;
			const maxPages = this.getNodeParameter('memberMaxPages', 0) as number;

			const all = await fetchInactiveMembers(this, {
				days,
				includeNever,
				limit,
				maxPages,
			});

			if (triggerMode === 'recurring') {
				items = all;
			} else {
				const dedupeKey = `inactive_phases_${days}_${includeNever ? '1' : '0'}`;
				const seenPhases = new Set<string>((store[dedupeKey] as string[]) || []);
				const fresh: IDataObject[] = [];

				for (const row of all) {
					const userId = String(row.id ?? '');
					if (!userId) continue;

					const lastLogin = row.lastLogin ?? 'never';
					const phaseKey = `${userId}:${lastLogin}`;

					if (this.getMode() === 'manual') {
						fresh.push(row);
						continue;
					}

					if (!seenPhases.has(phaseKey)) {
						seenPhases.add(phaseKey);
						fresh.push(row);
					}
				}

				store[dedupeKey] = Array.from(seenPhases).slice(-5000);
				items = fresh;
			}
		}

		if (!items.length) return null;
		return [this.helpers.returnJsonArray(items)];
	}
}
