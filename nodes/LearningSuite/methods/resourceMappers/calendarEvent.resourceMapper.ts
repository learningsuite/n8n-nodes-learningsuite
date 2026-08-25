import type { ILoadOptionsFunctions, ResourceMapperFields, ResourceMapperField } from 'n8n-workflow';

const CALENDAR_EVENT_FIELDS: ResourceMapperField[] = [
	{ id: 'name', displayName: 'Name (Max. 35 Characters)', type: 'string' },
	{ id: 'description', displayName: 'Description', type: 'string' },
	{ id: 'priority', displayName: 'Priority (0-9, Lower Shows First)', type: 'number' },
	{ id: 'startDate', displayName: 'Start Date (YYYY-MM-DD)', type: 'string' },
	{ id: 'startTime', displayName: 'Start Time (HH:mm)', type: 'string' },
	{ id: 'duration', displayName: 'Duration (Minutes)', type: 'number' },
	{ id: 'timeZone', displayName: 'Time Zone (IANA, e.g. Europe/Berlin)', type: 'string' },
	{
		id: 'repetitionInterval',
		displayName: 'Repetition Interval',
		type: 'options',
		options: [
			{ name: 'One Time', value: 'oneTime' },
			{ name: 'Weekly', value: 'weekly' },
			{ name: 'Bi-Weekly', value: 'biWeekly' },
		],
	},
	{ id: 'endDate', displayName: 'End Date (YYYY-MM-DD)', type: 'string' },
	{ id: 'link', displayName: 'Link (Event URL)', type: 'string' },
].map((field) => ({
	...field,
	required: false,
	display: true,
	defaultMatch: false,
	canBeUsedToMatch: false,
})) as ResourceMapperField[];

export const CALENDAR_EVENT_FIELD_IDS = CALENDAR_EVENT_FIELDS.map((field) => field.id);

export async function getCalendarEventResourceMapperFields(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	return { fields: CALENDAR_EVENT_FIELDS };
}
