import type { INodeProperties } from 'n8n-workflow';

export const roleProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getAll',
		displayOptions: { show: { resource: ['role'] } },
		options: [
			{ name: 'Get Many', value: 'getAll', description: 'Retrieve a list of user roles', action: 'Get many roles' },
		],
	},
];
