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
	if (typeof raw === 'object') return raw as IDataObject;
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		throw new NodeOperationError(ctx.getNode(), `Invalid JSON in "${name}": ${String(err)}`);
	}
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new NodeOperationError(ctx.getNode(), `"${name}" must be a JSON object`);
	}
	return parsed as IDataObject;
}

const agentChat: ExecuteHandler = async (ctx, i) => {
	const agentId = ctx.getNodeParameter('agentId', i) as string;
	if (!agentId) throw new NodeOperationError(ctx.getNode(), 'AI Agent is required');

	const body: IDataObject = {
		userId: ctx.getNodeParameter('userId', i) as string,
		chatId: ctx.getNodeParameter('chatId', i, undefined),
		message: ctx.getNodeParameter('message', i, undefined),
		includeChatHistory: ctx.getNodeParameter('includeChatHistory', i, false),
		endChat: ctx.getNodeParameter('endChat', i, false),
		metadata: parseJsonObjectParam(ctx, i, 'metadata'),
		profileContext: parseJsonObjectParam(ctx, i, 'profileContext'),
	};

	const cleanBody = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== undefined && v !== ''));

	return await lsRequest.call(ctx, 'POST', `/ai-agents/${encodeURIComponent(agentId)}/chat`, { body: cleanBody });
};

const ragChat: ExecuteHandler = async (ctx, i) => {
	const body: IDataObject = {
		question: ctx.getNodeParameter('question', i) as string,
		userId: ctx.getNodeParameter('userId', i, undefined),
		conversationId: ctx.getNodeParameter('conversationId', i, undefined),
		addCitations: ctx.getNodeParameter('addCitations', i, false),
		systemPromptAddition: ctx.getNodeParameter('systemPromptAddition', i, undefined),
		answerLength: ctx.getNodeParameter('answerLength', i, 'standard'),
		tone: ctx.getNodeParameter('tone', i, 'neutral'),
		format: ctx.getNodeParameter('format', i, 'markdown'),
		unlockContentDrip: ctx.getNodeParameter('unlockContentDrip', i, false),
	};

	// Remove keys with undefined or empty string values so optional params are not sent as empty
	const cleanBody = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== undefined && v !== ''));

	return await lsRequest.call(ctx, 'POST', '/ai/rag-chat', { body: cleanBody });
};

export const aiHandlers = {
	agentChat,
	getAgentActions,
	getAiAgents,
	ragChat,
};
