import type { IAuthenticate, ICredentialTestRequest, ICredentialType, Icon, INodeProperties } from 'n8n-workflow';

export class LearningSuiteApi implements ICredentialType {
	name = 'learningSuiteApi';
	displayName = 'LearningSuite API';
	icon: Icon = 'file:learningsuite.svg';
	documentationUrl = 'https://github.com/learningsuite/n8n-nodes-learningsuite/blob/main/CREDENTIALS.md';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'API key provided by LearningSuite',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.learningsuite.io/api/v1',
			required: true,
			description: 'Base URL of the LearningSuite API',
		},
	];

	authenticate: IAuthenticate = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/auth',
			method: 'GET',
			headers: {
				accept: 'application/json',
			},
		},
	};
}
