import type { INodeProperties } from 'n8n-workflow';

export const aiProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'agentChat',
		displayOptions: { show: { resource: ['ai'] } },
		options: [
			{
				name: 'Agent Chat',
				value: 'agentChat',
				description: 'Send a message to an AI agent and get the response',
				action: 'Send message to AI agent',
			},
			{
				name: 'Concierge Chat',
				value: 'conciergeChat',
				description: 'Send a message to the global AI Concierge agent and get the response',
				action: 'Send message to AI concierge',
			},
			{
				name: 'Get Agent Actions',
				value: 'getAgentActions',
				description: 'List all agent actions',
				action: 'List agent actions',
			},
			{
				name: 'Get AI Agents',
				value: 'getAiAgents',
				description: 'List all enabled AI agents',
				action: 'List AI agents',
			},
		],
	},
	{
		displayName: 'AI Agent Name or ID',
		name: 'agentId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'ai_getAiAgents' },
		required: true,
		default: '',
		description:
			'The AI agent to chat with. For the global AI Concierge agent, you may also use the shortcut "concierge". Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: { show: { resource: ['ai'], operation: ['agentChat'] } },
	},
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		required: true,
		default: '',
		description:
			'The user ID of the member sending the message. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: { show: { resource: ['ai'], operation: ['agentChat', 'conciergeChat'] } },
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		description: 'The message you want to send to the AI agent',
		displayOptions: { show: { resource: ['ai'], operation: ['agentChat', 'conciergeChat'] } },
	},
	{
		displayName: 'Chat ID',
		name: 'chatId',
		type: 'string',
		default: '',
		description: 'The chat/conversation you want to send the message to. Leave empty to start a new chat.',
		displayOptions: { show: { resource: ['ai'], operation: ['agentChat', 'conciergeChat'] } },
	},
	{
		displayName: 'Include Chat History',
		name: 'includeChatHistory',
		type: 'boolean',
		default: false,
		description:
			'Whether to return the full chat history in the response. Otherwise, only the latest agent response is returned.',
		displayOptions: { show: { resource: ['ai'], operation: ['agentChat', 'conciergeChat'] } },
	},
	{
		displayName: 'End Chat',
		name: 'endChat',
		type: 'boolean',
		default: false,
		description:
			'Whether to end the chat after this message. The agent will not generate a response. Useful when filling out a form is complete.',
		displayOptions: { show: { resource: ['ai'], operation: ['agentChat', 'conciergeChat'] } },
	},
	{
		displayName: 'Metadata',
		name: 'metadata',
		type: 'json',
		default: '{}',
		description:
			'If a previous agent response included metadata, it should be included in the next request. Provide as JSON object.',
		displayOptions: { show: { resource: ['ai'], operation: ['agentChat', 'conciergeChat'] } },
	},
	{
		displayName: 'Profile Context',
		name: 'profileContext',
		type: 'json',
		default: '{}',
		description:
			'Optional profile context to use when interacting with custom field (forms). Only used if the agent config supports it. Leave as {} to omit. Expected structure: { "selectedProfileIdByCard": { "cardId": "profileId or null" } } - keys are custom field card IDs, values are profile IDs or null for the default profile.',
		displayOptions: { show: { resource: ['ai'], operation: ['agentChat', 'conciergeChat'] } },
	},
];
