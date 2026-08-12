import type { INodeProperties } from 'n8n-workflow';

export const communityProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getAreas',
		displayOptions: { show: { resource: ['community'] } },
		options: [
			{
				name: 'Assign Badges to Member',
				value: 'assignBadgesToUser',
				description: 'Assign one or more badges to a member',
				action: 'Assign badges to member',
			},
			{
				name: 'Create Community Post',
				value: 'createCommunityPost',
				description: 'Create a community post or answer in a discussion',
				action: 'Create community post',
			},
			{
				name: 'Create Community Post Comment',
				value: 'commentOnPost',
				description: 'Comment on a community post or reply to an existing comment',
				action: 'Add comment to post',
			},
			{
				name: 'Get Community Areas',
				value: 'getAreas',
				description: 'List community areas',
				action: 'Get community areas',
			},
			{
				name: 'Get Community Badges',
				value: 'getBadges',
				description: 'List community badges (optionally filtered by badge group)',
				action: 'Get community badges',
			},
			{
				name: 'Get Community Forums',
				value: 'getForums',
				description: 'List community forums (optionally filtered by area)',
				action: 'Get community forums',
			},
			{
				name: 'Get Community Posts',
				value: 'getCommunityPosts',
				description: 'List all published community posts (optionally filtered by area or forum)',
				action: 'Get community posts',
			},
			{
				name: 'Remove Community Badges From Member',
				value: 'removeBadgesFromUser',
				description: 'Remove one or more badges from a member',
				action: 'Remove badges from member',
			},
		],
	},
	{
		displayName: 'Area Name or ID',
		name: 'areaId',
		type: 'options',
		displayOptions: { show: { resource: ['community'], operation: ['getForums'] } },
		default: '',
		typeOptions: { loadOptionsMethod: 'community_getAreas' },
		description:
			'ID of the community area to filter forums. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Optional filter for badges (for listing + for LoadOptions when assigning/removing)
	{
		displayName: 'Badge Group ID',
		name: 'badgeGroupId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['community'],
				operation: ['getBadges', 'assignBadgesToUser', 'removeBadgesFromUser'],
			},
		},
		default: '',
		description: 'If set, only badges from this badge group will be used/displayed',
	},
	// Member selection for assign/remove
	{
		displayName: 'Member Name or ID',
		name: 'memberId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		displayOptions: {
			show: { resource: ['community'], operation: ['assignBadgesToUser', 'removeBadgesFromUser'] },
		},
		default: '',
		required: true,
		description:
			'Member to whom badges are assigned or revoked. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Badge Names or IDs',
		name: 'badgeIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'community_getBadges',
			loadOptionsDependsOn: ['badgeGroupId'],
		},
		displayOptions: {
			show: { resource: ['community'], operation: ['assignBadgesToUser', 'removeBadgesFromUser'] },
		},
		default: [],
		required: true,
		description:
			'Select one or more badges. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName:
			'You can select multiple badges. The badge selector can optionally be filtered by <b>Badge Group ID</b>.',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['community'], operation: ['assignBadgesToUser', 'removeBadgesFromUser'] },
		},
		default: '',
		description:
			'You can select multiple badges. The badge selector can optionally be filtered by <b>Badge Group ID</b>.',
	},
	{
		displayName: 'Community Post Name or ID',
		name: 'postId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'community_getLatestPosts',
		},
		displayOptions: { show: { resource: ['community'], operation: ['commentOnPost'] } },
		default: '',
		required: true,
		description:
			'The community post to comment on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Author Name or ID',
		name: 'authorUserId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'teamMember_getTeamMembersById' },
		displayOptions: { show: { resource: ['community'], operation: ['commentOnPost', 'createCommunityPost'] } },
		default: '',
		required: true,
		description:
			'Select a team member as author. The author must have access to the target forum. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Comment Text',
		name: 'commentText',
		type: 'string',
		typeOptions: { rows: 4 },
		displayOptions: { show: { resource: ['community'], operation: ['commentOnPost'] } },
		default: '',
		required: true,
		description: 'Text of your comment to be added to the post',
	},
	{
		displayName: 'Answer to Comment ID',
		name: 'answerToCommentId',
		type: 'string',
		displayOptions: { show: { resource: ['community'], operation: ['commentOnPost'] } },
		default: '',
		description: 'If set, this comment will be posted as a reply to another comment',
	},
	{
		displayName: 'Enable Webhook Triggering',
		name: 'enableWebhookTriggering',
		type: 'boolean',
		displayOptions: { show: { resource: ['community'], operation: ['commentOnPost'] } },
		default: false,
		description:
			'Whether commenting via API should trigger webhooks. By default, API comments do NOT trigger webhooks. Enabling this can fire events like community.post.commented. WARNING: This may cause infinite loops if the webhook triggers the same API again',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		description: 'Max number of results to return',
		displayOptions: {
			show: { resource: ['community'], operation: ['getAreas', 'getBadges', 'getForums', 'getCommunityPosts'] },
		},
		typeOptions: { minValue: 1 },
		default: 50,
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: { resource: ['community'], operation: ['getAreas', 'getBadges', 'getForums', 'getCommunityPosts'] },
		},
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Number of results to skip for pagination',
	},
	// === Get Community Posts ===
	{
		displayName: 'Area Name or ID',
		name: 'areaId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'community_getAreas' },
		displayOptions: {
			show: { resource: ['community'], operation: ['getCommunityPosts', 'createCommunityPost'] },
		},
		default: '',
		placeholder: 'Select Area (optional)',
		description:
			'Filter forums by community area. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Forum Name or ID',
		name: 'forumId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'community_getForums',
			loadOptionsDependsOn: ['areaId'],
		},
		displayOptions: {
			show: { resource: ['community'], operation: ['getCommunityPosts', 'createCommunityPost'] },
		},
		default: '',
		placeholder: 'Select Forum',
		description:
			'The forum in which the post should be published. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Post Title',
		name: 'postTitle',
		type: 'string',
		displayOptions: { show: { resource: ['community'], operation: ['createCommunityPost'] } },
		default: '',
		description: 'Title of the post. Only applicable to discussions.',
	},
	{
		displayName: 'Answer to Post ID',
		name: 'answerToPostId',
		type: 'string',
		displayOptions: { show: { resource: ['community'], operation: ['createCommunityPost'] } },
		default: '',
		description: 'If set, this post is created as an answer to another post. Only applicable to discussions.',
	},
	{
		displayName: 'Content Format',
		name: 'contentFormat',
		type: 'options',
		displayOptions: { show: { resource: ['community'], operation: ['createCommunityPost'] } },
		options: [
			{ name: 'Text or HTML', value: 'string' },
			{ name: 'JSON Array', value: 'json' },
		],
		default: 'string',
		description: 'Format to send for the post content',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: { rows: 6 },
		displayOptions: {
			show: { resource: ['community'], operation: ['createCommunityPost'], contentFormat: ['string'] },
		},
		default: '',
		required: true,
		description: 'Content of the post. May be plain text or HTML.',
	},
	{
		displayName: 'Content JSON',
		name: 'contentJson',
		type: 'json',
		typeOptions: { rows: 6 },
		displayOptions: {
			show: { resource: ['community'], operation: ['createCommunityPost'], contentFormat: ['json'] },
		},
		default: '[]',
		required: true,
		description: 'Content of the post as a JSON array of objects, for example Slate content',
	},
	{
		displayName: 'Element JSON',
		name: 'elementJson',
		type: 'json',
		typeOptions: { rows: 4 },
		displayOptions: { show: { resource: ['community'], operation: ['createCommunityPost'] } },
		default: '{}',
		description: 'Optional post element as a JSON object, for example a content link. Only applicable to feed posts.',
	},
	{
		displayName: 'Order',
		name: 'order',
		type: 'options',
		displayOptions: {
			show: { resource: ['community'], operation: ['getCommunityPosts'] },
		},
		options: [
			{ name: 'Latest', value: 'latest' },
			{ name: 'Latest Content', value: 'latestContent' },
			{ name: 'Top', value: 'top' },
			{ name: 'Relevance', value: 'relevance' },
		],
		default: 'latest',
		description: 'Order of posts to return',
	},
	// === END getPosts ===
];
