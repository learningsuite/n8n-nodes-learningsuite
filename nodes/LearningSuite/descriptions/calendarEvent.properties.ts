import type { INodeProperties } from 'n8n-workflow';

const RESOURCE = 'calendarEvent';

const show = (...operations: string[]) => ({
	show: { resource: [RESOURCE], ...(operations.length ? { operation: operations } : {}) },
});

function availabilityFields(
	prefix: 'availableFrom' | 'availableUntil',
	label: string,
	relationDescription: string,
): INodeProperties[] {
	return [
		{
			displayName: `${label}: Relation`,
			name: `${prefix}Relation`,
			type: 'options',
			options: [
				{ name: 'After Event End', value: 'afterEventEnd' },
				{ name: 'After Event Start', value: 'afterEventStart' },
				{ name: 'Before Event End', value: 'beforeEventEnd' },
				{ name: 'Before Event Start', value: 'beforeEventStart' },
				{ name: 'Not Set (Natural Start/End)', value: '' },
			],
			default: '',
			description: relationDescription,
		},
		{
			displayName: `${label}: Amount`,
			name: `${prefix}Amount`,
			type: 'number',
			typeOptions: { minValue: 0 },
			default: 0,
			description: 'How many units before/after the reference point. Only used when a relation is selected.',
		},
		{
			displayName: `${label}: Unit`,
			name: `${prefix}Unit`,
			type: 'options',
			options: [
				{ name: 'Minutes', value: 'minutes' },
				{ name: 'Hours', value: 'hours' },
				{ name: 'Days', value: 'days' },
			],
			default: 'minutes',
			description: 'Unit of the amount. Only used when a relation is selected.',
		},
	];
}

function linkStageValues(): INodeProperties[] {
	return [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://zoom.us/j/123456789',
			description: 'Link of this phase. Must be a valid http(s) URL.',
		},
		{
			displayName: 'Enabled',
			name: 'enabled',
			type: 'boolean',
			default: true,
			description: 'Whether this phase is active',
		},
		{
			displayName: 'Button Label',
			name: 'ctaLabel',
			type: 'string',
			default: '',
			description: 'Button text for this phase (max. 40 characters). Leave empty for the default text.',
		},
		{
			displayName: 'Button Icon',
			name: 'iconName',
			type: 'string',
			default: '',
			description: 'Button icon name. Leave empty for the default icon.',
		},
		{
			displayName: 'Button Color',
			name: 'buttonStyle',
			type: 'string',
			default: '',
			placeholder: '#FF0000, primary or black',
			description: 'Button color as a hex code, or "primary"/"black"',
		},
		{
			displayName: 'Status Label',
			name: 'statusLabel',
			type: 'string',
			default: '',
			placeholder: 'LIVE',
			description: 'Short badge text shown on the card while this phase is active (max. 12 characters).',
		},
		...availabilityFields(
			'availableFrom',
			'Available From',
			'When this phase starts. Leave unset for the natural start (before: open-ended, during: event start, after: event end).',
		),
		...availabilityFields(
			'availableUntil',
			'Available Until',
			'When this phase ends. Leave unset for the natural end (before: event start, during: event end, after: open-ended).',
		),
	];
}

const reminderChannelValues: INodeProperties[] = [
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		description: 'Whether the reminder is sent for this channel',
	},
	{
		displayName: 'Lead Minutes',
		name: 'leadMinutes',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 1440 },
		default: 10,
		description: 'How many minutes before each occurrence the reminder is sent (1-1440)',
	},
];

export const calendarEventProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getAll',
		displayOptions: show(),
		options: [
			{
				name: 'Create Calendar Event',
				value: 'create',
				description: 'Create a calendar event series',
				action: 'Create a calendar event',
			},
			{
				name: 'Delete Calendar Event',
				value: 'delete',
				description: 'Delete a calendar event series including all of its occurrences',
				action: 'Delete a calendar event',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'List calendar event series (never individual dates)',
				action: 'Get many calendar events',
			},
			{
				name: 'Update Calendar Event',
				value: 'update',
				description: 'Update a calendar event series (only the fields you provide)',
				action: 'Update a calendar event',
			},
		],
	},
	{
		displayName: 'From Date',
		name: 'fromDate',
		type: 'string',
		placeholder: '2026-07-20',
		displayOptions: show('getAll'),
		default: '',
		description:
			'Start of the range (YYYY-MM-DD, inclusive). Selects series whose lifetime overlaps the range, not their individual dates; the range is widened by one day for timezone tolerance. Leave empty to return every series.',
	},
	{
		displayName: 'To Date',
		name: 'toDate',
		type: 'string',
		placeholder: '2026-12-21',
		displayOptions: show('getAll'),
		default: '',
		description:
			'End of the range (YYYY-MM-DD, inclusive). Only usable together with From Date; leave empty for an open-ended range.',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		description: 'Max number of results to return',
		displayOptions: show('getAll'),
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		displayOptions: show('getAll'),
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Number of results to skip for pagination',
	},
	{
		displayName: 'Calendar Event Name or ID',
		name: 'calendarEventSeriesId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'calendarEvent_getCalendarEvents' },
		displayOptions: show('update', 'delete'),
		default: '',
		required: true,
		description:
			'ID of the calendar event series. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: show('create'),
		default: '',
		required: true,
		description: 'Display name of the event, shown on the calendar card (max. 35 characters).',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'string',
		placeholder: '2026-07-20',
		displayOptions: show('create'),
		default: '',
		required: true,
		description: 'Date of the first occurrence (YYYY-MM-DD), interpreted in the event time zone',
	},
	{
		displayName: 'Start Time',
		name: 'startTime',
		type: 'string',
		placeholder: '18:00',
		displayOptions: show('create'),
		default: '',
		required: true,
		description: 'Start time of every occurrence (HH:mm, 24-hour), interpreted in the event time zone',
	},
	{
		displayName: 'Time Zone',
		name: 'timeZone',
		type: 'string',
		placeholder: 'Europe/Berlin',
		displayOptions: show('create'),
		default: 'Europe/Berlin',
		required: true,
		description: 'IANA time zone for all dates/times of this event, e.g. Europe/Berlin or Europe/Vienna',
	},
	{
		displayName: 'Repetition Interval',
		name: 'repetitionInterval',
		type: 'options',
		displayOptions: show('create'),
		options: [
			{ name: 'One Time', value: 'oneTime', description: 'Single occurrence on the start date' },
			{ name: 'Weekly', value: 'weekly', description: 'Repeats every 7 days' },
			{ name: 'Bi-Weekly', value: 'biWeekly', description: 'Repeats every 14 days' },
		],
		default: 'oneTime',
		required: true,
		description: 'How often the event repeats',
	},
	{
		displayName: 'Link',
		name: 'link',
		type: 'string',
		placeholder: 'https://zoom.us/j/123456789',
		displayOptions: show('create'),
		default: '',
		required: true,
		description: 'The event link members join through, e.g. a Zoom or Meet URL. Must be a valid URL.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: show('create'),
		options: [
			{
				displayName: 'Bundle Names or IDs',
				name: 'bundleIds',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'bundle_getBundles' },
				default: [],
				description:
					'Bundles whose owners get access to the event. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Short description shown on the calendar card on hover',
			},
			{
				displayName: 'Duration (Minutes)',
				name: 'duration',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 60,
				description: 'Duration in minutes (e.g. 60 = one hour). Omit for open-ended events.',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				placeholder: '2026-12-21',
				default: '',
				description: 'Last date a recurring series repeats (YYYY-MM-DD, inclusive). Omit for open-ended series.',
			},
			{
				displayName: 'Group Names or IDs',
				name: 'groupIds',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'group_getGroups' },
				default: [],
				description:
					'Groups whose members get access to the event. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Member Names or IDs',
				name: 'memberIds',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: [],
				description:
					'Users (IDs or email addresses) that get access to the event. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 9 },
				default: 3,
				description: 'Display priority 0-9; lower numbers are shown first. Defaults to 3.',
			},
		],
	},
	{
		displayName: 'Reminders',
		name: 'notificationSettings',
		type: 'fixedCollection',
		placeholder: 'Add Reminder Channel',
		default: {},
		displayOptions: show('create'),
		description:
			'Reminder settings of the event. Each enabled channel notifies all users with access before every occurrence. Channels you do not add send nothing.',
		options: [
			{ displayName: 'Push', name: 'push', values: reminderChannelValues },
			{ displayName: 'Email', name: 'email', values: reminderChannelValues },
		],
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'resourceMapper',
		noDataExpression: true,
		required: true,
		default: { mappingMode: 'defineBelow', value: null },
		displayOptions: show('update'),
		description:
			'Fields to send to the API. Only mapped fields are changed, everything else keeps its current value. Set a field to the expression {{ null }} to clear it — the API allows that for Description, Duration and End Date only.',
		typeOptions: {
			resourceMapper: {
				resourceMapperMethod: 'getCalendarEventResourceMapperFields',
				mode: 'add',
				fieldWords: { singular: 'field', plural: 'fields' },
				addAllFields: false,
				multiKeyMatch: false,
				supportAutoMap: true,
			},
		},
	},
	{
		displayName: 'Reminders',
		name: 'notificationSettings',
		type: 'fixedCollection',
		placeholder: 'Add Reminder Channel',
		default: {},
		displayOptions: show('update'),
		description:
			'Reminder settings of the event. Leave empty to keep the current reminders; adding it replaces all channels. To stop all reminders, add both channels with Enabled turned off.',
		options: [
			{ displayName: 'Push', name: 'push', values: reminderChannelValues },
			{ displayName: 'Email', name: 'email', values: reminderChannelValues },
		],
	},
	{
		displayName: 'Link Stages',
		name: 'linkStages',
		type: 'fixedCollection',
		placeholder: 'Add Link Stage',
		default: {},
		displayOptions: show('create', 'update'),
		description:
			'Per-phase links of the event. Requires the "During" phase; "Before"/"After" are optional and fall back to the single link. When set, link stages replace all existing phases and take precedence over the single link.',
		options: [
			{ displayName: 'Before', name: 'before', values: linkStageValues() },
			{ displayName: 'During', name: 'during', values: linkStageValues() },
			{ displayName: 'After', name: 'after', values: linkStageValues() },
		],
	},
];
