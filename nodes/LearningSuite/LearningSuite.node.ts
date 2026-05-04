import {
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	type IDataObject,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

import type { HandlersRegistry } from './exec.types';

// methods - loadOptions
import * as loBundle from './methods/loadOptions/bundle.loadOptions';
import * as loCommunity from './methods/loadOptions/community.loadOptions';
import * as loCourse from './methods/loadOptions/course.loadOptions';
import * as loGroup from './methods/loadOptions/group.loadOptions';
import * as loHub from './methods/loadOptions/hub.loadOptions';
import * as loMember from './methods/loadOptions/member.loadOptions';
import * as loModule from './methods/loadOptions/module.loadOptions';
import * as loPopup from './methods/loadOptions/popup.loadOptions';
import * as loRole from './methods/loadOptions/role.loadOptions';
import * as loWebhook from './methods/loadOptions/webhook.loadOptions';
import * as loTeamMember from './methods/loadOptions/teamMember.loadOptions';
import * as loCustomFields from './methods/loadOptions/customFields.loadOptions';

import { getTemplateVariablesResourceMapperFields } from './methods/resourceMappers/hub.resourceMapper';
import { getMultipleCustomFieldValueResourceMapperFields } from './methods/resourceMappers/customFields.resourceMapper';

// properties
import { resourceSelector } from './descriptions/resource.selector';
import { apiCallProperties } from './descriptions/apiCall.properties';
import { bundleProperties } from './descriptions/bundle.properties';
import { communityProperties } from './descriptions/community.properties';
import { courseProperties } from './descriptions/course.properties';
import { groupProperties } from './descriptions/group.properties';
import { hubProperties } from './descriptions/hub.properties';
import { memberProperties } from './descriptions/member.properties';
import { moduleProperties } from './descriptions/module.properties';
import { popupProperties } from './descriptions/popup.properties';
import { roleProperties } from './descriptions/role.properties';
import { teamMemberProperties } from './descriptions/teamMember.properties';
import { userProperties } from './descriptions/user.properties';
import { webhookProperties } from './descriptions/webhook.properties';
import { customFieldsProperties } from './descriptions/customFields.properties';
import { aiProperties } from './descriptions/ai.properties';

// handlers
import { apiCallHandlers } from './execute/apiCall.handlers';
import { bundleHandlers } from './execute/bundle.handlers';
import { communityHandlers } from './execute/community.handlers';
import { courseHandlers } from './execute/course.handlers';
import { groupHandlers } from './execute/group.handlers';
import { hubHandlers } from './execute/hub.handlers';
import { memberHandlers } from './execute/member.handlers';
import { moduleHandlers } from './execute/module.handlers';
import { popupHandlers } from './execute/popup.handlers';
import { roleHandlers } from './execute/role.handlers';
import { teamMemberHandlers } from './execute/teamMember.handlers';
import { userHandlers } from './execute/user.handlers';
import { webhookHandlers } from './execute/webhook.handlers';
import { customFieldsHandlers } from './execute/customFields.handlers';
import { aiHandlers } from './execute/ai.handlers';

const registry: HandlersRegistry = {
	ai: { ...aiHandlers },
	apiCall: { ...apiCallHandlers },
	bundle: { ...bundleHandlers },
	community: { ...communityHandlers },
	course: { ...courseHandlers },
	customFields: { ...customFieldsHandlers },
	group: { ...groupHandlers },
	hub: { ...hubHandlers },
	member: { ...memberHandlers },
	module: { ...moduleHandlers },
	popup: { ...popupHandlers },
	role: { ...roleHandlers },
	teamMember: { ...teamMemberHandlers },
	user: { ...userHandlers },
	webhook: { ...webhookHandlers },
};

export class LearningSuite implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LearningSuite',
		name: 'learningSuite',
		icon: {
			light: 'file:./icons/learningsuite-icon-light.svg',
			dark: 'file:./icons/learningsuite-icon-dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with LearningSuite API (powered by agentur-systeme.de)',
		defaults: {
			name: 'LearningSuite',
			// @ts-expect-error -- description required by linter
			description: 'Interact with LearningSuite API (powered by agentur-systeme.de)',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'learningSuiteApi',
				required: true,
				// @ts-expect-error -- description required by linter
				description: 'LearningSuite API Test',
			},
		],
		properties: [
			resourceSelector,
			...aiProperties,
			...apiCallProperties,
			...bundleProperties,
			...communityProperties,
			...courseProperties,
			...customFieldsProperties,
			...groupProperties,
			...hubProperties,
			...memberProperties,
			...moduleProperties,
			...popupProperties,
			...roleProperties,
			...teamMemberProperties,
			...userProperties,
			...webhookProperties,
		],
	};

	methods = {
		loadOptions: {
			...loBundle,
			...loCommunity,
			...loCourse,
			...loCustomFields,
			...loGroup,
			...loHub,
			...loMember,
			...loModule,
			...loPopup,
			...loRole,
			...loTeamMember,
			...loWebhook,
		},
		resourceMapping: {
			getTemplateVariablesResourceMapperFields,
			getMultipleCustomFieldValueResourceMapperFields,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				const handler = registry[resource]?.[operation];
				if (!handler) {
					throw new NodeOperationError(
						this.getNode(),
						`No handler for resource "${resource}" and operation "${operation}"`,
						{ itemIndex: i },
					);
				}

				const response = await handler(this, i);

				if (Array.isArray(response)) {
					for (const item of response) {
						returnData.push({
							json: item as IDataObject,
							pairedItem: { item: i },
						});
					}
				} else if (response && typeof response === 'object') {
					returnData.push({
						json: response as IDataObject,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: items[i].json,
						error:
							error instanceof NodeApiError || error instanceof NodeOperationError
								? error
								: new NodeOperationError(this.getNode(), error as Error, { itemIndex: i }),
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
