import type { IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getPublished: ExecuteHandler = async (ctx) => lsRequest.call(ctx, 'GET', '/courses/published');

const getModules: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/courses/${courseId}/modules`);
};

const getModulesForMember: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/courses/${courseId}/modules/${memberId}`);
};

const getMembers: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	const limit = ctx.getNodeParameter('limit', i, 100) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	const includeProgress = ctx.getNodeParameter('includeProgress', i, false) as boolean;

	const qs: IDataObject = {
		limit,
		offset,
		includeProgress,
	};

	return await lsRequest.call(ctx, 'GET', `/courses/${courseId}/members`, { qs });
};

const getAccessRequests: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;

	const qs: IDataObject = {
		limit,
		offset,
	};

	return await lsRequest.call(ctx, 'GET', `/courses/${courseId}/access-requests`, { qs });
};

const getSubmissions: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;

	const qs: IDataObject = {
		limit,
		offset,
	};

	return await lsRequest.call(ctx, 'GET', `/courses/${courseId}/submissions`, { qs });
};

const createLesson: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	const sectionId = ctx.getNodeParameter('sectionId', i) as string;
	const lessonName = ctx.getNodeParameter('lessonName', i) as string;
	const add = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;

	type LessonSortPosition = 'first' | 'last';
	const sortPosRaw = add.lessonSortPosition as string | undefined;
	const sortPos: LessonSortPosition = sortPosRaw === 'first' || sortPosRaw === 'last' ? sortPosRaw : 'last';

	if (add.lessonDescription) {
		ctx.logger.warn(
			'[LearningSuite] Deprecated field "lessonDescription" was provided but is no longer sent to the API.',
		);

		ctx.sendMessageToUI?.('The field "Lesson Description" is deprecated and will be ignored.');
	}

	const body: IDataObject = {
		name: lessonName,
		htmlContent: add.htmlContent,
		videoUrl: add.videoUrl,
		thumbnailUrl: add.thumbnailUrl,
		immediatelyPublishCourse: add.immediatelyPublishCourse,
		lessonSortPosition: sortPos,
	};

	if (add.timestampInSecondsToGenerateThumbnail !== undefined && add.videoUrl) {
		const ts = Number(add.timestampInSecondsToGenerateThumbnail);
		if (!Number.isNaN(ts)) {
			body.timestampInSecondsToGenerateThumbnail = ts;
		}
	}

	Object.keys(body).forEach((k) => {
		if (body[k] === '' || body[k] == null) delete body[k];
	});

	return lsRequest.call(ctx, 'POST', `/courses/${courseId}/create-lesson/${sectionId}`, { body });
};

const publishCourse: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	const publishOptions = ctx.getNodeParameter('publishOptions', i, {}) as IDataObject;

	const body: IDataObject = {
		versionName: publishOptions.versionName,
		versionNotes: publishOptions.versionNotes,
		notifyMembers: publishOptions.notifyMembers,
		updateMessage: publishOptions.updateMessage,
	};

	Object.keys(body).forEach((k) => {
		if (body[k] === '' || body[k] === undefined || body[k] === null) delete body[k];
	});

	return lsRequest.call(ctx, 'POST', `/courses/${courseId}/publish`, { body });
};

const updateLesson: ExecuteHandler = async (ctx, i) => {
	const lessonId = ctx.getNodeParameter('lessonId', i) as string;
	const fields = ctx.getNodeParameter('lessonUpdateFields', i, {}) as IDataObject;

	const body: IDataObject = {};
	if (fields.name) body.name = String(fields.name);
	if (fields.visibility) body.visibility = String(fields.visibility);

	if (!body.name && !body.visibility) {
		throw new NodeOperationError(ctx.getNode(), 'Please provide at least one lesson field to update.');
	}

	return lsRequest.call(ctx, 'PUT', `/lessons/${encodeURIComponent(lessonId)}`, { body });
};

export const courseHandlers = {
	getPublished,
	getModules,
	getModulesForMember,
	getMembers,
	getAccessRequests,
	getSubmissions,
	createLesson,
	publishCourse,
	updateLesson,
};
