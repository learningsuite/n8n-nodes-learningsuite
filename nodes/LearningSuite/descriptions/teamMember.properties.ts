import type { INodeProperties } from 'n8n-workflow';

export const teamMemberProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['teamMember'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many team members',
				description: 'Retrieve a list of team members (admin-zone users)',
			},
			{
				name: 'Get by Email',
				value: 'getByEmail',
				action: 'Get team member by email',
				description: 'Retrieve a team member by email',
			},
			{
				name: 'Get by ID',
				value: 'getById',
				action: 'Get team member by ID',
				description: 'Retrieve a team member by user ID',
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: { show: { resource: ['teamMember'], operation: ['getAll'] } },
	},
	// getAll: offset
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Number of users to skip',
		displayOptions: { show: { resource: ['teamMember'], operation: ['getAll'] } },
	},
	// getByEmail: email
	{
		displayName: 'Team Member Name or ID',
		name: 'email',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'teamMember_getTeamMembersByEmail' },
		required: true,
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: { show: { resource: ['teamMember'], operation: ['getByEmail'] } },
	},
	// getOne: userId
	{
		displayName: 'Team Member Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'teamMember_getTeamMembersById' },
		required: true,
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: { show: { resource: ['teamMember'], operation: ['getById'] } },
	},
];
