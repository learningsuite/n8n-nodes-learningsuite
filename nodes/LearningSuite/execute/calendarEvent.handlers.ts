import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { lsRequest, toIdArray } from '../shared';
import type { ExecuteHandler } from '../exec.types';
import { CALENDAR_EVENT_FIELD_IDS } from '../methods/resourceMappers/calendarEvent.resourceMapper';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_OF_DAY = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

const LINK_STAGES = ['before', 'during', 'after'] as const;
type LinkStageName = (typeof LINK_STAGES)[number];

const NULLABLE_FIELDS = ['description', 'duration', 'endDate'];

function isClearedByUser(ctx: IExecuteFunctions, field: string, value: unknown): boolean {
	if (value !== null) return false;
	if (!NULLABLE_FIELDS.includes(field)) {
		throw new NodeOperationError(
			ctx.getNode(),
			`The API cannot clear "${field}" — only ${NULLABLE_FIELDS.join(', ')} accept null. Provide a value instead.`,
		);
	}
	return true;
}

function assertIsoDate(ctx: IExecuteFunctions, label: string, value: string): void {
	if (!ISO_DATE.test(value)) {
		throw new NodeOperationError(ctx.getNode(), `${label} must be a date in the format YYYY-MM-DD (e.g. 2026-07-20).`);
	}
}

function assertTimeOfDay(ctx: IExecuteFunctions, label: string, value: string): void {
	if (!TIME_OF_DAY.test(value)) {
		throw new NodeOperationError(ctx.getNode(), `${label} must be a time in the format HH:mm (e.g. 18:00).`);
	}
}

/** fixedCollection entries arrive as an object or — with multipleValues — as an array. */
function firstEntry(value: unknown): IDataObject | undefined {
	if (Array.isArray(value)) return (value[0] as IDataObject) ?? undefined;
	if (value && typeof value === 'object') return value as IDataObject;
	return undefined;
}

function buildAvailability(values: IDataObject, prefix: 'availableFrom' | 'availableUntil'): IDataObject | undefined {
	const relation = String(values[`${prefix}Relation`] ?? '').trim();
	if (!relation) return undefined;

	return {
		amount: Number(values[`${prefix}Amount`] ?? 0),
		unit: String(values[`${prefix}Unit`] ?? 'minutes'),
		relation,
	};
}

function buildLinkStage(ctx: IExecuteFunctions, stage: LinkStageName, values: IDataObject): IDataObject {
	const url = String(values.url ?? '').trim();
	if (!url) {
		throw new NodeOperationError(ctx.getNode(), `Link stage "${stage}" requires a URL.`);
	}

	const result: IDataObject = { url };
	if (values.enabled !== undefined) result.enabled = values.enabled as boolean;

	const ctaLabel = String(values.ctaLabel ?? '').trim();
	if (ctaLabel) result.ctaLabel = ctaLabel;

	const iconName = String(values.iconName ?? '').trim();
	if (iconName) result.iconName = iconName;

	const buttonStyle = String(values.buttonStyle ?? '').trim();
	if (buttonStyle) result.color = buttonStyle;

	const statusLabel = String(values.statusLabel ?? '').trim();
	if (statusLabel) result.statusLabel = statusLabel;

	const availableFrom = buildAvailability(values, 'availableFrom');
	if (availableFrom) result.availableFrom = availableFrom;

	const availableUntil = buildAvailability(values, 'availableUntil');
	if (availableUntil) result.availableUntil = availableUntil;

	return result;
}

function buildLinkStages(ctx: IExecuteFunctions, i: number): IDataObject | undefined {
	const raw = ctx.getNodeParameter('linkStages', i, {}) as IDataObject;

	const stages: IDataObject = {};
	for (const stage of LINK_STAGES) {
		const values = firstEntry(raw[stage]);
		if (values) stages[stage] = buildLinkStage(ctx, stage, values);
	}

	if (!Object.keys(stages).length) return undefined;
	if (!stages.during) {
		throw new NodeOperationError(
			ctx.getNode(),
			'Link stages require the "During" phase. Add it, or remove the other phases to keep the single link.',
		);
	}

	return stages;
}

function buildNotificationSettings(ctx: IExecuteFunctions, i: number): IDataObject | undefined {
	const raw = ctx.getNodeParameter('notificationSettings', i, {}) as IDataObject;

	const settings: IDataObject = {};
	for (const channel of ['push', 'email'] as const) {
		const values = firstEntry(raw[channel]);
		if (!values) continue;
		settings[channel] = {
			enabled: values.enabled !== false,
			leadMinutes: Number(values.leadMinutes ?? 10),
		};
	}

	return Object.keys(settings).length ? settings : undefined;
}

const getAll: ExecuteHandler = async (ctx, i) => {
	const fromDate = String(ctx.getNodeParameter('fromDate', i, '') || '').trim();
	const toDate = String(ctx.getNodeParameter('toDate', i, '') || '').trim();
	const limit = ctx.getNodeParameter('limit', i, 50) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;

	if (toDate && !fromDate) {
		throw new NodeOperationError(ctx.getNode(), 'To Date can only be used together with From Date.');
	}

	const qs: IDataObject = { limit, offset };
	if (fromDate) {
		assertIsoDate(ctx, 'From Date', fromDate);
		qs.fromDate = fromDate;
	}
	if (toDate) {
		assertIsoDate(ctx, 'To Date', toDate);
		qs.toDate = toDate;
	}

	return await lsRequest.call(ctx, 'GET', '/calendar-events', { qs });
};

const create: ExecuteHandler = async (ctx, i) => {
	const name = String(ctx.getNodeParameter('name', i, '') || '').trim();
	const startDate = String(ctx.getNodeParameter('startDate', i, '') || '').trim();
	const startTime = String(ctx.getNodeParameter('startTime', i, '') || '').trim();
	const timeZone = String(ctx.getNodeParameter('timeZone', i, '') || '').trim();
	const repetitionInterval = ctx.getNodeParameter('repetitionInterval', i, 'oneTime') as string;
	const link = String(ctx.getNodeParameter('link', i, '') || '').trim();

	if (!name) throw new NodeOperationError(ctx.getNode(), 'Please provide a name for the calendar event.');
	if (!timeZone) throw new NodeOperationError(ctx.getNode(), 'Please provide a time zone, e.g. Europe/Berlin.');
	if (!link) throw new NodeOperationError(ctx.getNode(), 'Please provide the event link.');
	assertIsoDate(ctx, 'Start Date', startDate);
	assertTimeOfDay(ctx, 'Start Time', startTime);

	const body: IDataObject = { name, startDate, startTime, timeZone, repetitionInterval, link };

	const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

	const description = String(additionalFields.description ?? '').trim();
	if (description) body.description = description;

	if (additionalFields.priority !== undefined) body.priority = additionalFields.priority as number;
	if (additionalFields.duration !== undefined) body.duration = additionalFields.duration as number;

	const endDate = String(additionalFields.endDate ?? '').trim();
	if (endDate) {
		assertIsoDate(ctx, 'End Date', endDate);
		body.endDate = endDate;
	}

	const memberIds = toIdArray(additionalFields.memberIds);
	if (memberIds.length) body.memberIds = memberIds;

	const groupIds = toIdArray(additionalFields.groupIds);
	if (groupIds.length) body.groupIds = groupIds;

	const bundleIds = toIdArray(additionalFields.bundleIds);
	if (bundleIds.length) body.bundleIds = bundleIds;

	const notificationSettings = buildNotificationSettings(ctx, i);
	if (notificationSettings) body.notificationSettings = notificationSettings;

	const linkStages = buildLinkStages(ctx, i);
	if (linkStages) body.linkStages = linkStages;

	return await lsRequest.call(ctx, 'POST', '/calendar-events', { body });
};

const UPDATE_FIELD_LABELS: Record<string, string> = {
	startDate: 'Start Date',
	startTime: 'Start Time',
	endDate: 'End Date',
};

const update: ExecuteHandler = async (ctx, i) => {
	const calendarEventSeriesId = String(ctx.getNodeParameter('calendarEventSeriesId', i, '') || '').trim();
	if (!calendarEventSeriesId) {
		throw new NodeOperationError(ctx.getNode(), 'Please provide the ID of the calendar event.');
	}

	const mapped = ctx.getNodeParameter('updateFields', i, {}) as { value?: IDataObject | null };
	const values = mapped?.value ?? {};
	const body: IDataObject = {};

	for (const field of CALENDAR_EVENT_FIELD_IDS) {
		if (!(field in values)) continue;

		const raw = values[field];
		if (raw === undefined) continue;

		if (isClearedByUser(ctx, field, raw)) {
			body[field] = null;
			continue;
		}

		if (typeof raw === 'string') {
			const value = raw.trim();
			if (!value) continue;

			const label = UPDATE_FIELD_LABELS[field];
			if (field === 'startDate' || field === 'endDate') assertIsoDate(ctx, label, value);
			if (field === 'startTime') assertTimeOfDay(ctx, label, value);

			body[field] = value;
			continue;
		}

		body[field] = raw as IDataObject[string];
	}

	const notificationSettings = buildNotificationSettings(ctx, i);
	if (notificationSettings) body.notificationSettings = notificationSettings;

	const linkStages = buildLinkStages(ctx, i);
	if (linkStages) body.linkStages = linkStages;

	if (!Object.keys(body).length) {
		throw new NodeOperationError(ctx.getNode(), 'Please provide at least one field to update.');
	}

	return await lsRequest.call(ctx, 'PATCH', `/calendar-events/${calendarEventSeriesId}`, { body });
};

const deleteCalendarEvent: ExecuteHandler = async (ctx, i) => {
	const calendarEventSeriesId = String(ctx.getNodeParameter('calendarEventSeriesId', i, '') || '').trim();
	if (!calendarEventSeriesId) {
		throw new NodeOperationError(ctx.getNode(), 'Please provide the ID of the calendar event.');
	}

	return await lsRequest.call(ctx, 'DELETE', `/calendar-events/${calendarEventSeriesId}`);
};

export const calendarEventHandlers = {
	getAll,
	create,
	update,
	delete: deleteCalendarEvent,
};
