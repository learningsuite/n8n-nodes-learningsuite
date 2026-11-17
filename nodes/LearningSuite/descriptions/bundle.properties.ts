import type { INodeProperties } from 'n8n-workflow';

export const bundleProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getAll',
		displayOptions: { show: { resource: ['bundle'] } },
		options: [
			{ name: 'Get Many', value: 'getAll', description: 'Retrieve a list of bundles', action: 'Get many bundles' },
			{
				name: 'Get Members',
				value: 'getMembers',
				description: 'List members of a bundle, including access information if available',
				action: 'Get bundle members',
			},
		],
	},
	{
		displayName: 'Bundle Name or ID',
		name: 'bundleId',
		type: 'options',
		displayOptions: { show: { resource: ['bundle'], operation: ['getMembers'] } },
		typeOptions: { loadOptionsMethod: 'bundle_getBundles' },
		default: '',
		required: true,
		description:
			'ID of the bundle. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];
