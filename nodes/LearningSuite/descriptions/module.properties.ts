import type { INodeProperties } from 'n8n-workflow';

export const moduleProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getLessons',
		displayOptions: { show: { resource: ['module'] } },
		options: [
			{
				name: 'Change Module Access for Member',
				value: 'createUnlockOverride',
				description: 'Change a member’s access to a module (unlock override)',
				action: 'Change module access',
			},
			{
				name: 'Get Module Lessons',
				value: 'getLessons',
				description: 'List lessons for a module',
				action: 'Get module lessons',
			},
			{
				name: 'Get Module Sections',
				value: 'getSections',
				description: 'List sections for a module',
				action: 'Get module sections',
			},
		],
	},
	// (new) optional course filter - makes module selection easier
	{
		displayName: 'Course Name or ID',
		name: 'courseId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'course_getCourses' },
		displayOptions: {
			show: { resource: ['module'], operation: ['getLessons', 'getSections', 'createUnlockOverride'] },
		},
		default: '',
		description:
			'Optional: Filters the modules to this course. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Module Name or ID',
		name: 'moduleId',
		type: 'options',
		displayOptions: {
			show: { resource: ['module'], operation: ['getLessons', 'getSections', 'createUnlockOverride'] },
		},
		typeOptions: {
			loadOptionsMethod: 'module_getModules',
			loadOptionsDependsOn: ['courseId'],
		},
		default: '',
		required: true,
		description:
			'Select a module. Optionally, select a course first to filter the list. Or enter an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Member Name or ID',
		name: 'memberId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		displayOptions: { show: { resource: ['module'], operation: ['createUnlockOverride'] } },
		default: '',
		description:
			'Optional: Member for which the unlock applies (sent to the API as "userId"). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'New Module Access',
		name: 'newModuleAccess',
		type: 'options',
		options: [
			{ name: 'After Previous', value: 'after_previous' },
			{ name: 'Hidden', value: 'hidden' },
			{ name: 'Locked', value: 'locked' },
			{ name: 'On Demand', value: 'on_demand' },
			{ name: 'Published', value: 'published' },
		],
		displayOptions: { show: { resource: ['module'], operation: ['createUnlockOverride'] } },
		default: 'on_demand',
		description: 'New access mode for the module (e.g., "on_demand")',
	},
];
