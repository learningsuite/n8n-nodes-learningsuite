import { NodeOperationError, type IDataObject } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getAgentActions: ExecuteHandler = async (ctx) => {
	return await lsRequest.call(ctx, 'GET', '/agent-actions');
};

const getAiAgents: ExecuteHandler = async (ctx) => {
	return await lsRequest.call(ctx, 'GET', '/ai-agents');
};

function parseJsonObjectParam(ctx: Parameters<ExecuteHandler>[0], i: number, name: string): IDataObject | undefined {
	const raw = ctx.getNodeParameter(name, i, '') as string | IDataObject | undefined;
	if (raw === undefined || raw === null || raw === '') return undefined;

	let parsed: unknown = raw;
	if (typeof raw !== 'object') {
		try {
			parsed = JSON.parse(raw);
		} catch (err) {
			throw new NodeOperationError(ctx.getNode(), `Invalid JSON in "${name}": ${String(err)}`);
		}
	}

	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new NodeOperationError(ctx.getNode(), `"${name}" must be a JSON object`);
	}

	// The "{}" placeholder means "not set" - sending it would fail the API's schema validation
	if (Object.keys(parsed).length === 0) return undefined;

	return parsed as IDataObject;
}

const PROFILE_CONTEXT_EXAMPLE = '{ "selectedProfileIdByCard": { "<cardId>": "<profileId or null>" } }';

/** Reads and validates the optional profile context, which the API only accepts fully formed. */
function buildProfileContext(ctx: Parameters<ExecuteHandler>[0], i: number): IDataObject | undefined {
	const profileContext = parseJsonObjectParam(ctx, i, 'profileContext');
	if (!profileContext) return undefined;

	const selection = profileContext.selectedProfileIdByCard;
	if (!selection || typeof selection !== 'object' || Array.isArray(selection)) {
		throw new NodeOperationError(ctx.getNode(), '"Profile Context" must contain a "selectedProfileIdByCard" object', {
			itemIndex: i,
			description: `Expected structure: ${PROFILE_CONTEXT_EXAMPLE}. Keys are custom field card IDs, values are profile IDs (or null for the default profile).`,
		});
	}

	const invalid = Object.entries(selection as IDataObject)
		.filter(([, v]) => v !== null && typeof v !== 'string')
		.map(([k]) => k);

	if (invalid.length) {
		throw new NodeOperationError(
			ctx.getNode(),
			`"Profile Context" contains invalid profile IDs for the following cards: ${invalid.join(', ')}`,
			{
				itemIndex: i,
				description: `Each value must be a profile ID string or null (= default profile). Expected structure: ${PROFILE_CONTEXT_EXAMPLE}.`,
			},
		);
	}

	return profileContext;
}

/** Builds the chat request body shared by the agent and concierge chat endpoints. */
function buildChatBody(ctx: Parameters<ExecuteHandler>[0], i: number): IDataObject {
	const body: IDataObject = {
		userId: ctx.getNodeParameter('userId', i) as string,
		chatId: ctx.getNodeParameter('chatId', i, undefined),
		message: ctx.getNodeParameter('message', i, undefined),
		includeChatHistory: ctx.getNodeParameter('includeChatHistory', i, false),
		endChat: ctx.getNodeParameter('endChat', i, false),
		metadata: parseJsonObjectParam(ctx, i, 'metadata'),
		profileContext: buildProfileContext(ctx, i),
	};

	// Remove keys with undefined or empty string values so optional params are not sent as empty
	return Object.fromEntries(Object.entries(body).filter(([, v]) => v !== undefined && v !== ''));
}

const agentChat: ExecuteHandler = async (ctx, i) => {
	const agentId = ctx.getNodeParameter('agentId', i) as string;
	if (!agentId) throw new NodeOperationError(ctx.getNode(), 'AI Agent is required');

	return await lsRequest.call(ctx, 'POST', `/ai-agents/${encodeURIComponent(agentId)}/chat`, {
		body: buildChatBody(ctx, i),
	});
};

const conciergeChat: ExecuteHandler = async (ctx, i) => {
	return await lsRequest.call(ctx, 'POST', '/ai-agents/concierge/chat', { body: buildChatBody(ctx, i) });
};

export const aiHandlers = {
	agentChat,
	conciergeChat,
	getAgentActions,
	getAiAgents,
};
