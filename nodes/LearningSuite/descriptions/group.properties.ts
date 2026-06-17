import type { INodeProperties } from 'n8n-workflow';

export const groupProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'findOrCreate',
		displayOptions: { show: { resource: ['group'] } },
		options: [
			{
				name: 'Add Bundles to Group',
				value: 'addBundles',
				description: 'Add one or more bundles to a group',
				action: 'Add bundles to group',
			},
			{
				name: 'Add Courses to Group',
				value: 'addCourses',
				description: 'Add one or more courses to a group',
				action: 'Add courses to group',
			},
			{
				name: 'Add Members to Groups',
				value: 'addMembers',
				description: 'Add one or more members to one or more groups',
				action: 'Add members to groups',
			},
			{
				name: 'Add Members to Groups (Summary)',
				value: 'addMembersSummary',
				description: 'Add members to groups and return only a summary of changes',
				action: 'Add members to groups summary',
			},
			{ name: 'Create Group', value: 'create', description: 'Create a new group', action: 'Create a group' },
			{ name: 'Delete Group', value: 'delete', description: 'Delete a group by ID', action: 'Delete a group' },
			{
				name: 'Find Group by Name',
				value: 'findByName',
				description: 'Find groups by name',
				action: 'Find groups by name',
			},
			{
				name: 'Find or Create Group',
				value: 'findOrCreate',
				description: 'Find a group by name or create it if not found',
				action: 'Find or create group',
			},
			{
				name: 'Get Group by ID',
				value: 'getById',
				description: 'Get a single group by ID',
				action: 'Get group by ID',
			},
			{
				name: 'Get Group Courses',
				value: 'getCourses',
				description: 'List courses assigned to a group',
				action: 'Get group courses',
			},
			{ name: 'Get Many', value: 'getAll', description: 'List groups', action: 'Get many groups' },
			{
				name: 'Remove Courses From Group',
				value: 'removeCourses',
				description: 'Remove one or more courses from a group',
				action: 'Remove courses from group',
			},
			{
				name: 'Remove Members From Groups',
				value: 'removeMembers',
				description: 'Remove one or more members from one or more groups',
				action: 'Remove members from groups',
			},
		],
	},
	{
		displayName: 'Group Name or ID',
		name: 'groupId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'group_getGroups' },
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['delete', 'getById', 'getCourses', 'addCourses', 'removeCourses', 'addBundles'],
			},
		},
		default: '',
		required: true,
		description:
			'ID of the group. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Group Names or IDs',
		name: 'groupIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'group_getGroups' },
		displayOptions: { show: { resource: ['group'], operation: ['addMembers', 'addMembersSummary', 'removeMembers'] } },
		default: [],
		description:
			'Select one or more groups. Comma-separated list of group IDs. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		displayOptions: { show: { resource: ['group'], operation: ['create', 'findByName', 'findOrCreate'] } },
		default: '',
		required: true,
		description: 'Name of the group',
	},
	{
		displayName: 'User Name or IDs',
		name: 'userIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		displayOptions: { show: { resource: ['group'], operation: ['addMembers', 'addMembersSummary', 'removeMembers'] } },
		default: [],
		description:
			'Select one or more users. Comma-separated list of user IDs. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Course Names or IDs',
		name: 'courseIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'course_getCourses' },
		displayOptions: { show: { resource: ['group'], operation: ['addCourses', 'removeCourses'] } },
		default: [],
		description:
			'Select one or more courses. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Bundle Names or IDs',
		name: 'bundleIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'bundle_getBundles' },
		displayOptions: { show: { resource: ['group'], operation: ['addBundles'] } },
		default: [],
		description:
			'Select one or more bundles. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['group'], operation: ['getAll', 'getById', 'findByName', 'findOrCreate'] } },
		options: [
			{
				displayName: 'Include Users',
				name: 'includeUsers',
				type: 'boolean',
				default: false,
				description: 'Whether to include users in the group results',
			},
		],
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: { resource: ['group'], operation: ['addMembers', 'addMembersSummary', 'addCourses', 'addBundles'] },
		},
		default: {},
		options: [
			{
				displayName: 'Disable Access Notification Email',
				name: 'disableAccessNotificationEmail',
				type: 'boolean',
				default: false,
				description: 'Whether the access notification email should be deactivated. Default is false.',
			},
		],
	},
];
