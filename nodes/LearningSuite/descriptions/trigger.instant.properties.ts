import type { INodeProperties } from 'n8n-workflow';

export const instantProperties: INodeProperties[] = [
	// Event selection (instant only)
	{
		displayName: 'Event',
		name: 'event',
		type: 'options',
		default: 'communityPost.created',
		description: 'Select the LearningSuite instant (webhook) event',
		options: [
			{
				name: 'Agent Action Executed',
				value: 'agentAction.executed',
				description: 'Triggers when an AI agent action has been executed',
			},
			{
				name: 'Community Post Commented',
				value: 'communityPost.commented',
				description: 'Triggers when a community post was commented',
			},
			{
				name: 'Community Post Created',
				value: 'communityPost.created',
				description: 'Triggers when a new community post is created',
			},
			{
				name: 'Community Post Moderated',
				value: 'communityPost.moderated',
				description: 'Triggers when a community post was moderated (accepted or rejected)',
			},
			{
				name: 'Course Member Added',
				value: 'course.memberAdded',
				description: 'Triggers when a member has been added to a course',
			},
			{
				name: 'Course Progress Changed',
				value: 'courseProgress.changed',
				description: 'Triggers when the course progress of a member crosses a given threshold',
			},
			{
				name: 'Course Updated',
				value: 'course.updated',
				description: 'Triggers when a course has been updated',
			},
			{
				name: 'Custom Field Value Changed Events',
				value: 'customField.valueChanged',
				description: 'Triggers when a custom field value has been changed',
			},
			{
				name: 'Custom Popup Interaction',
				value: 'customPopup.interaction',
				description: 'Triggers when a member interacts with a custom popup',
			},
			{ name: 'Exam Completed', value: 'exam.completed', description: 'Triggers when a member finishes an exam' },
			{
				name: 'Exam Graded',
				value: 'exam.graded',
				description: 'Triggers when an exam is graded (manually or automatically)',
			},
			{
				name: 'Group User Access Changed',
				value: 'group.userAccessChanged',
				description: 'Triggers when a member is added to or removed from a group',
			},
			{
				name: 'Lesson Completed',
				value: 'lesson.completed',
				description: 'Triggers when a lesson has been completed by a member',
			},
			{
				name: 'New Access Request',
				value: 'accessRequest.created',
				description: 'Triggers when a user requests access to a module in the course',
			},
			{
				name: 'New Feedback Created',
				value: 'feedback.created',
				description: 'Triggers when a user submits new feedback',
			},
			{ name: 'New Login', value: 'login.new', description: 'Triggers when a member logs in' },
			{
				name: 'Submission Created',
				value: 'submission.created',
				description: 'Triggers when a member submits an interactive task (file, audio, video, text)',
			},
			{
				name: 'User Activation Status Changed',
				value: 'user.activationStatusChanged',
				description: 'Triggers when a user is activated or deactivated',
			},
		],
	},
	// Agent Action Executed
	{
		displayName: 'Agent Action Executed Options',
		name: 'additionalAgentActionExecuted',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['agentAction.executed'] } },
		options: [
			{
				displayName: 'Tool Key Name or ID',
				name: 'toolKey',
				type: 'options',
				default: '',
				description:
					'Optional: Only trigger for a specific agent action. Leave empty to trigger for all actions. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: { loadOptionsMethod: 'ai_getAgentActions' },
			},
			{
				displayName: 'Agent Name or ID',
				name: 'agentId',
				type: 'options',
				default: '',
				description:
					'Optional: Only trigger for actions executed by a specific AI agent. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: { loadOptionsMethod: 'ai_getAiAgents' },
			},
		],
	},
	// New Login
	{
		displayName: 'Login Options',
		name: 'additionalLoginNew',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['login.new'] } },
		options: [
			{
				displayName: 'Login Type',
				name: 'loginType',
				type: 'options',
				default: '',
				description:
					'Filter by login type. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				options: [
					{ name: 'All', value: '' },
					{ name: 'App Email Code', value: 'app-email-code' },
					{ name: 'Auto Login', value: 'auto-login' },
					{ name: 'Email & Password', value: 'email-password' },
					{ name: 'Google', value: 'google' },
					{ name: 'Impersonated by Admin', value: 'impersonated-by-admin' },
					{ name: 'Impersonation (as Member)', value: 'impersonation' },
					{ name: 'Magic Link', value: 'magic-link' },
					{ name: 'OIDC', value: 'oidc' },
					{ name: 'Password Reset', value: 'password-reset' },
					{ name: 'Refresh', value: 'refresh' },
				],
			},
			{
				displayName: 'User Role Name or ID',
				name: 'userRoleId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'role_getRoles',
				},
				default: '',
				description:
					'Optional role filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Custom Popup Interaction
	{
		displayName: 'Popup Interaction Options',
		name: 'additionalPopupInteraction',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['customPopup.interaction'] } },
		options: [
			{
				displayName: 'Popup Name or ID',
				name: 'customPopupId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'popup_getPopups' },
				default: '',
				description:
					'Optional popup filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				placeholder: 'Add option',
			},
			{
				displayName: 'Interaction Type',
				name: 'interactionType',
				type: 'options',
				default: '',
				description: 'Filter by interaction type',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Actioned', value: 'actioned' },
					{ name: 'Dismissed', value: 'dismissed' },
				],
			},
		],
	},

	// Course Progress Changed
	{
		displayName: 'Course Progress Above (%)',
		name: 'threshold',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 0, maxValue: 100 },
		description: 'Specify the threshold value to trigger (1-100) without the percent sign',
		displayOptions: { show: { event: ['courseProgress.changed'] } },
	},
	{
		displayName: 'Course Progress Options',
		name: 'additionalCourseProgress',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['courseProgress.changed'] } },
		options: [
			{
				displayName: 'Course Name or ID',
				name: 'courseId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
				description:
					'Optional course filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Community Post Created
	{
		displayName: 'Community Post (Created) Options',
		name: 'additionalCommunityPostCreated',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['communityPost.created'] } },
		options: [
			{
				displayName: 'Area Name or ID',
				name: 'areaId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
				placeholder: 'Add option',
			},
			{
				displayName: 'Forum Name or ID',
				name: 'forumId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'community_getForums',
					loadOptionsDependsOn: ['additionalCommunityPostCreated.areaId'],
				},
				default: '',
			},
			{
				displayName: 'Publish Status',
				name: 'publishStatus',
				type: 'options',
				options: [
					{ name: 'Both', value: 'both' },
					{ name: 'Published', value: 'published' },
					{ name: 'Waiting for Moderation', value: 'waiting for moderation' },
				],
				default: 'both',
				description:
					'If true, only posts that are published are returned. If false, only posts that are not published are returned (e.g. posts in moderated forums which are not handled yet.). If not set, both published and unpublished posts are returned. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Community Post Commented
	{
		displayName: 'Community Post (Commented) Options',
		name: 'additionalCommunityPostCommented',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['communityPost.commented'] } },
		options: [
			{
				displayName: 'Area Name or ID',
				name: 'areaId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
				description:
					'The ID of the area to filter for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Forum Name or ID',
				name: 'forumId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'community_getForums',
					loadOptionsDependsOn: ['additionalCommunityPostCommented.areaId'],
				},
				default: '',
				description:
					'The ID of the forum to filter for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Mentioned User Names or IDs',
				name: 'mentionedUserIds',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'teamMember_getTeamMembersById' },
				default: [],
				description:
					'If set, only comments that tag at least one of the given team-member IDs are returned. NOTE: only available for users with admin-zone access, not for members. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Community Post Moderated

	{
		displayName: 'Community Post (Moderated) Options',
		name: 'additionalCommunityPostModerated',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['communityPost.moderated'] } },
		options: [
			{
				displayName: 'Area Name or ID',
				name: 'areaId',
				type: 'options',
				description:
					'The ID of the area to filter for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
				placeholder: 'Add option',
			},
			{
				displayName: 'Forum Name or ID',
				name: 'forumId',
				type: 'options',
				description:
					'The ID of the forum to filter for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'community_getForums',
					loadOptionsDependsOn: ['additionalCommunityPostModerated.areaId'],
				},
				default: '',
			},
			{
				displayName: 'Approved Status',
				name: 'approved',
				type: 'options',
				options: [
					{ name: 'Both', value: 'both' },
					{ name: 'Approved (Yes)', value: 'approved' },
					{ name: 'Rejected (No)', value: 'rejected' },
				],
				default: 'both',
				description:
					'If true, only posts that are approved are returned. If false, only posts that are rejected are returned. If not set, both approved and rejected posts are returned. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Course Events (courseInstanceId)
	{
		displayName: 'Course Options',
		name: 'additionalCourseOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['course.updated', 'course.memberAdded'] } },
		options: [
			{
				displayName: 'Course Name or ID',
				name: 'courseId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
				description:
					'Optional course filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Feedback (courseInstanceId only)
	{
		displayName: 'Feedback Options',
		name: 'additionalFeedbackOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['feedback.created'] } },
		options: [
			{
				displayName: 'Course Name or ID',
				name: 'courseId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
				description:
					'Optional course filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Exam (courseInstanceId + examModuleId)
	{
		displayName: 'Exam Options',
		name: 'additionalExamOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['exam.completed', 'exam.graded'] } },
		options: [
			{
				displayName: 'Course Name or ID',
				name: 'courseId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
				description:
					'Optional course filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Exam Module Name or ID',
				name: 'examModuleId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'module_getModules',
					loadOptionsDependsOn: ['additionalExamOptions.courseId'],
				},
				default: '',
				description:
					'Optional module filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Access Request Course

	{
		displayName: 'Course Name or ID',
		name: 'courseId',
		type: 'options',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: { loadOptionsMethod: 'course_getCourses' },
		default: '',
		displayOptions: { show: { event: ['accessRequest.created'] } },
	},

	// Group User Access Changed
	{
		displayName: 'Action',
		name: 'actionType',
		type: 'options',
		default: 'added',
		options: [
			{ name: 'Added', value: 'added' },
			{ name: 'Removed', value: 'removed' },
		],
		displayOptions: { show: { event: ['group.userAccessChanged'] } },
	},
	{
		displayName: 'Group Access Options',
		name: 'additionalGroupAccess',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['group.userAccessChanged'] } },
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
		],
	},

	// Lesson Completed (cascading load options)
	{
		displayName: 'Lesson Completed Options',
		name: 'additionalLessonCompleted',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['lesson.completed'] } },
		options: [
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
					loadOptionsDependsOn: ['additionalLessonCompleted.courseId'],
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
					loadOptionsDependsOn: ['additionalLessonCompleted.moduleId'],
				},
				default: '',
			},
		],
	},

	// Submission Created (optional course)
	{
		displayName: 'Submission Options',
		name: 'additionalSubmission',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['submission.created'] } },
		options: [
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
	// Custom Field Value
	{
		displayName: 'Custom Field Options',
		name: 'additionalCustomFieldValueChanged',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				event: ['customField.valueChanged'],
			},
		},
		options: [
			{
				displayName: 'Custom Field Card Name or ID',
				name: 'customFieldCardId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'customFields_getCards',
				},
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
	},

	// User Activation Status Changed
	{
		displayName: 'Activation Status Options',
		name: 'additionalUserActivationStatus',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['user.activationStatusChanged'] } },
		options: [
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				default: '',
				description: 'Filter by activation status action',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Activated', value: 'activated' },
					{ name: 'Deactivated', value: 'deactivated' },
				],
			},
			{
				displayName: 'Role Name or ID',
				name: 'roleId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'role_getRoles' },
				default: '',
				description:
					'Filter for a specific user role. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},
];
