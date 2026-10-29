import type { IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';
import { courseHandlers } from './course.handlers';

const get: ExecuteHandler = async (ctx, i) => {
	const submissionId = ctx.getNodeParameter('submissionId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/submissions/${encodeURIComponent(submissionId)}`);
};

const grade: ExecuteHandler = async (ctx, i) => {
	const submissionId = ctx.getNodeParameter('submissionId', i) as string;
	const graderUserId = ctx.getNodeParameter('graderUserId', i) as string;
	const opts = ctx.getNodeParameter('gradingOptions', i, {}) as IDataObject;

	const body: IDataObject = { graderUserId };

	if (opts.grade !== undefined && opts.grade !== '' && opts.grade !== null) {
		const value = Number(opts.grade);
		if (!Number.isInteger(value) || value < 0 || value > 100) {
			throw new NodeOperationError(ctx.getNode(), 'Grade must be a whole number between 0 and 100.', {
				itemIndex: i,
			});
		}
		body.grade = value;
	}
	if (opts.comment) body.comment = String(opts.comment);
	if (opts.shouldRetry !== undefined) body.shouldRetry = Boolean(opts.shouldRetry);

	return await lsRequest.call(ctx, 'POST', `/submissions/${encodeURIComponent(submissionId)}/grade`, { body });
};

const addComment: ExecuteHandler = async (ctx, i) => {
	const submissionId = ctx.getNodeParameter('submissionId', i) as string;
	const authorUserId = ctx.getNodeParameter('authorUserId', i) as string;
	const commentText = ctx.getNodeParameter('commentText', i) as string;
	const internal = ctx.getNodeParameter('internal', i, false) as boolean;

	if (!commentText.trim()) {
		throw new NodeOperationError(ctx.getNode(), 'Comment Text must not be empty.', { itemIndex: i });
	}

	const body: IDataObject = { authorUserId, commentText, internal };

	return await lsRequest.call(ctx, 'POST', `/submissions/${encodeURIComponent(submissionId)}/comments`, {
		body,
	});
};

export const submissionHandlers = {
	get,
	getMany: courseHandlers.getSubmissions,
	grade,
	addComment,
};
