// webhook.sampleData.properties.ts

import type { INodeProperties } from 'n8n-workflow';

export const webhookSampleDataProperties: INodeProperties[] = [
	{
		displayName: 'Agent Action Executed Options',
		name: 'additionalAgentActionExecutedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['agent-action-executed-events'] } },
		options: [
			{
				displayName: 'Tool Key Name or ID',
				name: 'toolKey',
				type: 'options',
				default: '',
				description:
					'Optional tool key to filter agent action executions. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: { loadOptionsMethod: 'ai_getAgentActions' },
			},
			{
				displayName: 'Agent Name or ID',
				name: 'agentId',
				type: 'options',
				default: '',
				description:
					'Optional agent ID to filter agent action executions. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: { loadOptionsMethod: 'ai_getAiAgents' },
			},
		],
	},

	{
		displayName: 'Progress Changed Options',
		name: 'additionalProgressChangedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['progress-changed-events'] } },
		options: [
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
			{
				displayName: 'Course Name or ID',
				name: 'courseId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
			},
		],
	},

	{
		displayName: 'Lesson Completed Options',
		name: 'additionalLessonCompletedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['lesson-completed-events'] } },
		options: [
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
			{
				displayName: 'Course Name or ID',
				name: 'courseId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
			},
			{
				displayName: 'Module Name or ID',
				name: 'moduleId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'course_getModules',
					loadOptionsDependsOn: ['additionalLessonCompletedSample.courseId'],
				},
				default: '',
			},
			{
				displayName: 'Lesson Name or ID',
				name: 'lessonId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'module_getLessons',
					loadOptionsDependsOn: ['additionalLessonCompletedSample.moduleId'],
				},
				default: '',
			},
		],
	},

	{
		displayName: 'New Login Options',
		name: 'additionalNewLoginSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['new-login-events'] } },
		options: [
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
			{
				displayName: 'Login Type',
				name: 'loginType',
				type: 'options',
				default: 'email-password',
				options: [
					{ name: 'Auto Login', value: 'auto-login' },
					{ name: 'Email & Password', value: 'email-password' },
					{ name: 'Google', value: 'google' },
					{ name: 'Impersonated by Admin', value: 'impersonated-by-admin' },
					{ name: 'Impersonation (as Member)', value: 'impersonation' },
					{ name: 'Magic Link', value: 'magic-link' },
					{ name: 'OIDC', value: 'oidc' },
					{ name: 'Password Reset', value: 'password-reset' },
				],
			},
		],
	},

	{
		displayName: 'Exam Completed Options',
		name: 'additionalExamCompletedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['exam-completed-events'] } },
		options: [
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
		],
	},

	{
		displayName: 'Exam Graded Options',
		name: 'additionalExamGradedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['exam-graded-events'] } },
		options: [
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
		],
	},

	{
		displayName: 'Custom Popup Interaction Options',
		name: 'additionalCustomPopupInteractionSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['custom-popup-interaction-events'] } },
		options: [
			{
				displayName: 'Popup Name or ID',
				name: 'customPopupId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'popup_getPopups' },
				default: '',
			},
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
			{
				displayName: 'Interaction Type',
				name: 'interactionType',
				type: 'options',
				default: 'dismissed',
				options: [
					{ name: 'Dismissed', value: 'dismissed' },
					{ name: 'Actioned', value: 'actioned' },
				],
			},
		],
	},

	{
		displayName: 'Community Post Created Options',
		name: 'additionalCommunityPostCreatedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['community-post-created-events'] } },
		options: [
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
			{
				displayName: 'Area Name or ID',
				name: 'areaId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
			},
			{
				displayName: 'Forum Name or ID',
				name: 'forumId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'community_getForums',
					loadOptionsDependsOn: ['additionalCommunityPostCreatedSample.areaId'],
				},
				default: '',
			},
		],
	},

	{
		displayName: 'Community Post Moderated Options',
		name: 'additionalCommunityPostModeratedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['community-post-moderated-events'] } },
		options: [
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
			{
				displayName: 'Area Name or ID',
				name: 'areaId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
			},
			{
				displayName: 'Forum Name or ID',
				name: 'forumId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'community_getForums',
					loadOptionsDependsOn: ['additionalCommunityPostModeratedSample.areaId'],
				},
				default: '',
			},
		],
	},

	{
		displayName: 'Community Post Commented Options',
		name: 'additionalCommunityPostCommentedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['community-post-commented-events'] } },
		options: [
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
			{
				displayName: 'Post ID',
				name: 'postId',
				type: 'string',
				default: '',
			},
		],
	},

	{
		displayName: 'Group User Access Changed Options',
		name: 'additionalGroupUserAccessChangedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['group-user-access-changed-events'] } },
		options: [
			{
				displayName: 'Group Name or ID',
				name: 'groupId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'group_getGroups' },
				default: '',
			},
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
		],
	},

	{
		displayName: 'Course Updated Options',
		name: 'additionalCourseUpdatedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['course-updated-events'] } },
		options: [
			{
				displayName: 'Course Name or ID',
				name: 'courseInstanceId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
			},
		],
	},

	{
		displayName: 'Course Member Added Options',
		name: 'additionalCourseMemberAddedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['course-member-added-events'] } },
		options: [
			{
				displayName: 'Course Name or ID',
				name: 'courseInstanceId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
			},
		],
	},

	{
		displayName: 'User Activation Status Changed Options',
		name: 'additionalUserActivationStatusChangedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['user-activation-status-changed-events'] } },
		options: [
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				default: 'activated',
				description: 'The activation status action to use for sample data',
				options: [
					{ name: 'Activated', value: 'activated' },
					{ name: 'Deactivated', value: 'deactivated' },
				],
			},
		],
	},

	{
		displayName: 'Custom Field Value Changed Options',
		name: 'additionalCustomFieldValueChangedSample',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { sampleDataType: ['custom-field-value-changed'] } },
		options: [
			{
				displayName: 'Custom Field Card Name or ID',
				name: 'customFieldCardId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'customFields_getCards' },
				default: '',
			},
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
			},
		],
	},
];
