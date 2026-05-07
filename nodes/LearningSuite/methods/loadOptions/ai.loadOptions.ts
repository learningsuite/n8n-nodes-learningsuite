import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { fetchOptions } from './common';

export async function ai_getAgentActions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return fetchOptions.call(this, '/agent-actions', undefined, ['name'], ['toolKey']);
}

export async function ai_getAiAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return fetchOptions.call(this, '/ai-agents', undefined, ['name'], ['id']);
}
