import type { IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { lsRequest, toIdArray } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getAreas: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 50) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	return await lsRequest.call(ctx, 'GET', '/community/areas', { qs: { limit, offset } });
};

const getForums: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 50) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	const areaId = ctx.getNodeParameter('areaId', i, '') as string;
	const qs: IDataObject = { limit, offset };
	if (areaId) qs.areaId = areaId;
	return await lsRequest.call(ctx, 'GET', '/community/forums', { qs });
};

const getCommunityPosts: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	const areaId = ctx.getNodeParameter('areaId', i, '') as string;
	const forumId = ctx.getNodeParameter('forumId', i, '') as string;
	const order = ctx.getNodeParameter('order', i, 'latest') as string;

	const qs: IDataObject = { limit, offset, order };
	if (areaId) qs.areaId = areaId;
	if (forumId) qs.forumId = forumId;

	return await lsRequest.call(ctx, 'GET', '/community/posts', { qs });
};

const getBadges: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	const badgeGroupId = ctx.getNodeParameter('badgeGroupId', i, '') as string;
	const qs: IDataObject = { limit, offset };
	if (badgeGroupId) qs.badgeGroupId = badgeGroupId;
	return await lsRequest.call(ctx, 'GET', '/community/badges', { qs });
};

const assignBadgesToUser: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const badgeIds = toIdArray(ctx.getNodeParameter('badgeIds', i));

	if (!badgeIds.length) {
		throw new NodeOperationError(ctx.getNode(), 'Please select at least one badge.');
	}

	const body: IDataObject = { userId: memberId, badgeIds };
	return await lsRequest.call(ctx, 'PUT', '/community/badges/user', { body });
};

const removeBadgesFromUser: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const badgeIds = toIdArray(ctx.getNodeParameter('badgeIds', i));

	if (!badgeIds.length) {
		throw new NodeOperationError(ctx.getNode(), 'Please select at least one badge.');
	}

	const body: IDataObject = { userId: memberId, badgeIds };
	return await lsRequest.call(ctx, 'DELETE', '/community/badges/user', { body });
};

const createCommunityPost: ExecuteHandler = async (ctx, i) => {
	const authorUserId = String(ctx.getNodeParameter('authorUserId', i, '') || '').trim();
	const forumId = String(ctx.getNodeParameter('forumId', i, '') || '').trim();
	const postTitle = String(ctx.getNodeParameter('postTitle', i, '') || '').trim();
	const answerToPostId = String(ctx.getNodeParameter('answerToPostId', i, '') || '').trim();
	const contentFormat = ctx.getNodeParameter('contentFormat', i, 'string') as string;

	if (!authorUserId) {
		throw new NodeOperationError(ctx.getNode(), 'Please provide authorUserId.');
	}
	if (!forumId) {
		throw new NodeOperationError(ctx.getNode(), 'Please provide a forum ID.');
	}

	let content: string | IDataObject[];
	if (contentFormat === 'json') {
		const contentJson = ctx.getNodeParameter('contentJson', i, '[]') as string;
		try {
			content = JSON.parse(contentJson) as IDataObject[];
		} catch (err) {
			throw new NodeOperationError(ctx.getNode(), `Invalid JSON in content: ${String(err)}`);
		}
		if (!Array.isArray(content)) {
			throw new NodeOperationError(ctx.getNode(), 'Content JSON must be an array of objects.');
		}
	} else {
		content = String(ctx.getNodeParameter('content', i, '') || '').trim();
		if (!content) {
			throw new NodeOperationError(ctx.getNode(), 'The post content cannot be empty.');
		}
	}

	const body: IDataObject = {
		authorUserId,
		forumId,
		content,
	};

	if (postTitle) {
		body.postTitle = postTitle;
	}
	if (answerToPostId) {
		body.answerToPostId = answerToPostId;
	}

	const elementJson = String(ctx.getNodeParameter('elementJson', i, '{}') || '').trim();
	if (elementJson && elementJson !== '{}') {
		try {
			const element = JSON.parse(elementJson) as IDataObject;
			if (!element || Array.isArray(element) || typeof element !== 'object') {
				throw new Error('Element JSON must be an object.');
			}
			body.element = element;
		} catch (err) {
			throw new NodeOperationError(ctx.getNode(), `Invalid JSON in element: ${String(err)}`);
		}
	}

	return lsRequest.call(ctx, 'POST', '/community/posts', { body });
};

export const commentOnPost: ExecuteHandler = async (ctx, i) => {
	const postId = String(ctx.getNodeParameter('postId', i, '') || '').trim();
	const authorUserId = String(ctx.getNodeParameter('authorUserId', i, '') || '').trim();
	const commentText = String(ctx.getNodeParameter('commentText', i, '') || '').trim();
	const answerToCommentId = String(ctx.getNodeParameter('answerToCommentId', i, '') || '').trim();
	const enableWebhookTriggering = ctx.getNodeParameter('enableWebhookTriggering', i, false) as boolean;
	if (!postId) {
		throw new NodeOperationError(ctx.getNode(), 'Please provide a post ID.');
	}
	if (!authorUserId) {
		throw new NodeOperationError(ctx.getNode(), 'Please provide authorUserId (must be an admin user).');
	}
	if (!commentText) {
		throw new NodeOperationError(ctx.getNode(), 'The comment text cannot be empty (plain text only).');
	}
	const body: IDataObject = {
		authorUserId,
		commentText,
		enableWebhookTriggering,
	};

	if (answerToCommentId) {
		body.answerToCommentId = answerToCommentId;
	}

	return lsRequest.call(ctx, 'POST', `/community/posts/${postId}/comments`, { body });
};

export const communityHandlers = {
	getAreas,
	getForums,
	getBadges,
	assignBadgesToUser,
	removeBadgesFromUser,
	createCommunityPost,
	commentOnPost,
	getCommunityPosts,
};
