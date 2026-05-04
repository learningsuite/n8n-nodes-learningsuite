//n8n-nodes-learningsuite/nodes/LearningSuite/execute/user.handlers.ts
import type { IDataObject } from 'n8n-workflow';
import { lsRequest, toIdArray } from '../shared';
import type { ExecuteHandler } from '../exec.types';

/**
 * Send push notifications to users and/or groups
 */
const sendPushNotification: ExecuteHandler = async (ctx, i) => {
	const userIds = toIdArray(ctx.getNodeParameter('userIds', i));
	const groupIds = toIdArray(ctx.getNodeParameter('groupIds', i));

	const title = ctx.getNodeParameter('title', i, '') as string;
	const body = ctx.getNodeParameter('body', i, '') as string;
	const linkUrl = ctx.getNodeParameter('linkUrl', i) as string;
	const publicImageUrl = ctx.getNodeParameter('publicImageUrl', i, '') as string;

	const bodyPayload: IDataObject = { linkUrl };

	if (userIds.length > 0) bodyPayload.userIds = userIds;
	if (groupIds.length > 0) bodyPayload.groupIds = groupIds;
	if (title) bodyPayload.title = title;
	if (body) bodyPayload.body = body;
	if (publicImageUrl) bodyPayload.publicImageUrl = publicImageUrl;

	return await lsRequest.call(ctx, 'POST', '/user/push-notifications/send', {
		body: bodyPayload,
	});
};

export const userHandlers = {
	sendPushNotification, // 👈 KEY must exactly match the operation value
};
