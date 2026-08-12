//n8n-nodes-learningsuite/nodes/LearningSuite/descriptions/user.properties.ts
import type { INodeProperties } from 'n8n-workflow';

export const userProperties: INodeProperties[] = [
	{
		displayName: 'Note: This is only available if a custom app is used.',
		name: 'sendPushNotificationNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['sendPushNotification'],
			},
		},
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'sendPushNotification',
		displayOptions: { show: { resource: ['user'] } },
		options: [
			{
				name: 'Send Login Email',
				value: 'sendLoginEmail',
				action: 'Send login email',
				description: 'Send a login information email with a login link to a user',
			},
			{
				name: 'Send Push Notification',
				value: 'sendPushNotification',
				action: 'Send push notification',
				description: 'Send push notifications to selected users or groups (requires custom app with push support)',
			},
		],
	},
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['sendLoginEmail'],
			},
		},
		default: '',
		required: true,
		description:
			'User ID of the user who should receive a login link email. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// User IDs
	{
		displayName: 'User Name or IDs',
		name: 'userIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['sendPushNotification'],
			},
		},
		default: [],
		description:
			'List of user IDs to send the push notification to. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// Group IDs
	{
		displayName: 'Group Names or IDs',
		name: 'groupIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'group_getGroups' },
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['sendPushNotification'],
			},
		},
		default: [],
		description:
			'List of group IDs to send the push notification to all members of the group. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Either userIds or groupIds must be provided.',
		name: 'sendPushNotificationNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['sendPushNotification'],
			},
		},
	},

	// Title
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		description: 'The title of the push notification',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['sendPushNotification'],
			},
		},
	},

	// Body
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		default: '',
		description: 'The plain text body of the push notification',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['sendPushNotification'],
			},
		},
	},

	// Link URL (required)
	{
		displayName: 'Link URL',
		name: 'linkUrl',
		type: 'string',
		default: '',
		required: true,
		description: 'URL that will be opened when the user taps the notification',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['sendPushNotification'],
			},
		},
	},

	// Public Image URL
	{
		displayName: 'Public Image URL',
		name: 'publicImageUrl',
		type: 'string',
		default: '',
		description: 'Public image URL to show in the push notification',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['sendPushNotification'],
			},
		},
	},
];
