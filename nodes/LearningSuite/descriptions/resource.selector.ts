import type { INodeProperties } from 'n8n-workflow';

export const resourceSelector: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'AI',
			value: 'ai',
			description: 'Ask questions using AI with optional conversation context, tone, and formatting',
		},
		{
			name: 'API Call',
			value: 'apiCall',
			description: 'Execute any HTTP request to the LearningSuite API (relative endpoint, e.g., "/members")',
		},
		{
			name: 'Bundle',
			value: 'bundle',
			description: 'List bundles (course packages) and retrieve the members of a bundle',
		},
		{
			name: 'Calendar Event',
			value: 'calendarEvent',
			description: 'Manage calendar event series of the event plan',
		},
		{
			name: 'Community',
			value: 'community',
			description: 'Retrieve community areas and forums; Optionally filter by area',
		},
		{
			name: 'Course',
			value: 'course',
			description: 'Manage courses and their modules/sections/lessons, members, access requests, and submissions',
		},
		{
			name: 'Custom Field',
			value: 'customFields',
			description: 'Access and manage custom field cards, definitions, categories, values, and profiles',
		},
		{
			name: 'Group',
			value: 'group',
			description: 'Manage user groups (create/delete, add/remove members, assign courses/bundles)',
		},
		{
			name: 'Hub',
			value: 'hub',
			description: 'Manage hubs and templates; Add or remove access to members/groups/bundles',
		},
		{
			name: 'Member',
			value: 'member',
			description: 'Find/create/update/delete members and control course/bundle access',
		},
		{
			name: 'Module',
			value: 'module',
			description: 'Retrieve modules and associated sections and lessons; Create unlock overrides',
		},
		{
			name: 'Popup',
			value: 'popup',
			description: 'List/retrieve popups and trigger or reset them for members',
		},
		{
			name: 'Role',
			value: 'role',
			description: 'Retrieve available user roles',
		},
		{
			name: 'Team Member',
			value: 'teamMember',
			description: 'Retrieve available team members',
		},
		{
			name: 'User',
			value: 'user',
			description: 'Manage users and send push notifications',
		},
		{
			name: 'Webhook',
			value: 'webhook',
			description: 'Manage webhook subscriptions (create/read/update/delete) and load sample data',
		},
	],
	default: 'member',
};
