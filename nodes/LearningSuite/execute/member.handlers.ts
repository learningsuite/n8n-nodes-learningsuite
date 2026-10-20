import { NodeOperationError, type IDataObject } from 'n8n-workflow';
import { lsRequest, toIdArray, toIsoDateTime, getHttpCode } from '../shared';
import type { ExecuteHandler } from '../exec.types';

type HttpErrorLike = {
	httpCode?: number;
	statusCode?: number;
	status?: number;
	response?: {
		statusCode?: number;
		status?: number;
	};
	errorDetails?: {
		httpCode?: number;
	};
};

/** Converts an optional date option to IsoDateTime, failing loudly on unparsable input. */
function isoDateTimeOption(
	ctx: Parameters<ExecuteHandler>[0],
	i: number,
	label: string,
	value: unknown,
): string | undefined {
	if (value === undefined || value === null || value === '') return undefined;
	const iso = toIsoDateTime(value);
	if (!iso) {
		throw new NodeOperationError(ctx.getNode(), `"${label}" is not a valid date/time: ${String(value)}`, {
			itemIndex: i,
		});
	}
	return iso;
}

const getByEmail: ExecuteHandler = async (ctx, i) => {
	const email = ctx.getNodeParameter('email', i) as string;
	const includeGroups = ctx.getNodeParameter('includeGroups', i) as boolean;

	const qs: IDataObject = { email };
	if (includeGroups) qs.includeGroups = includeGroups;

	return await lsRequest.call(ctx, 'GET', '/members/by-email', { qs });
};

const getById: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const includeGroups = ctx.getNodeParameter('includeGroups', i) as boolean;
	const qs: IDataObject = {};
	if (includeGroups) qs.includeGroups = includeGroups;
	return await lsRequest.call(ctx, 'GET', `/members/${memberId}`, { qs });
};

const getAll: ExecuteHandler = async (ctx, i) => {
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;

	const includeGroups = ctx.getNodeParameter('includeGroups', i) as boolean;
	const limit = ctx.getNodeParameter('limit', i) as number;
	const offset = ctx.getNodeParameter('offset', i) as number;

	const qs: IDataObject = {};

	if (includeGroups !== undefined) qs.includeGroups = includeGroups;
	if (limit !== undefined) qs.limit = limit;
	if (offset !== undefined) qs.offset = offset;

	const days = additionalOptions.daysNotLoggedInGte as number;
	const includeNever = additionalOptions.includeNeverLoggedIn as boolean;

	if (days !== undefined) qs.days_not_logged_in_gte = days;
	if (includeNever !== undefined) qs.include_never_logged_in = includeNever;

	const createdAtGte = isoDateTimeOption(ctx, i, 'Created After', additionalOptions.createdAtGte);
	const createdAtLte = isoDateTimeOption(ctx, i, 'Created Before', additionalOptions.createdAtLte);
	if (createdAtGte) qs.created_at_gte = createdAtGte;
	if (createdAtLte) qs.created_at_lte = createdAtLte;

	return await lsRequest.call(ctx, 'GET', '/members', { qs });
};

const create: ExecuteHandler = async (ctx, i) => {
	const memberEmail = ctx.getNodeParameter('memberEmail', i) as string;
	const firstName = ctx.getNodeParameter('firstName', i) as string;
	const lastName = ctx.getNodeParameter('lastName', i) as string;
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;

	const body: IDataObject = {
		email: memberEmail,
		firstName,
		lastName,
		...additionalOptions,
	};
	for (const k of Object.keys(body)) {
		if (body[k] === '' || body[k] == null) delete body[k];
	}

	return lsRequest.call(ctx, 'POST', '/members', { body });
};

const update: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const firstName = ctx.getNodeParameter('firstName', i, '') as string;
	const lastName = ctx.getNodeParameter('lastName', i, '') as string;
	const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

	const body: IDataObject = { ...updateFields };
	if (firstName) body.firstName = firstName;
	if (lastName) body.lastName = lastName;

	for (const k of Object.keys(body)) {
		if (body[k] === '' || body[k] == null) delete body[k];
	}

	return lsRequest.call(ctx, 'PUT', `/members/${memberId}`, { body });
};

const del: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	return await lsRequest.call(ctx, 'DELETE', `/members/${memberId}`);
};

const activateDeactivate: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const activateAction = ctx.getNodeParameter('activateAction', i) as string;
	return await lsRequest.call(ctx, 'PUT', `/members/${memberId}`, { body: { enabled: activateAction === 'activate' } });
};

const addToCourses: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const courseIds = toIdArray(ctx.getNodeParameter('courseIds', i));
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	return await lsRequest.call(ctx, 'PUT', `/members/${memberId}/courses`, {
		body: { courseIds, ...additionalOptions },
	});
};

const removeFromCourses: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const courseIds = toIdArray(ctx.getNodeParameter('courseIds', i));
	return await lsRequest.call(ctx, 'DELETE', `/members/${memberId}/courses`, { body: { courseIds } });
};

const getCourses: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/members/${memberId}/courses`);
};

const getCourseInfo: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/members/${memberId}/course-info/${courseId}`);
};

const getCourseProgress: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const courseInstanceId = ctx.getNodeParameter('courseId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/members/${memberId}/course-progress/${courseInstanceId}`);
};

const getModuleProgress: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const courseInstanceId = ctx.getNodeParameter('courseId', i) as string;
	const moduleId = ctx.getNodeParameter('moduleId', i) as string;
	return await lsRequest.call(
		ctx,
		'GET',
		`/members/${memberId}/course-progress/${courseInstanceId}/module/${moduleId}`,
	);
};

const getLessonProgress: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const courseInstanceId = ctx.getNodeParameter('courseId', i) as string;
	const lessonId = ctx.getNodeParameter('lessonId', i) as string;
	return await lsRequest.call(
		ctx,
		'GET',
		`/members/${memberId}/course-progress/${courseInstanceId}/lesson/${lessonId}`,
	);
};

const setCourseProgress: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const courseInstanceId = ctx.getNodeParameter('courseId', i) as string;
	const setForWholeCourse = ctx.getNodeParameter('setForWholeCourse', i) as boolean;
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;

	const body: IDataObject = {};

	if (setForWholeCourse) {
		body.setForWholeCourse = true;
	} else {
		if (additionalOptions.modulesToSetCompleted) {
			body.modulesToSetCompleted = toIdArray(additionalOptions.modulesToSetCompleted);
		}
		if (additionalOptions.lessonsToSetCompleted) {
			body.lessonsToSetCompleted = toIdArray(additionalOptions.lessonsToSetCompleted);
		}
		if (additionalOptions.pagesToSetCompleted) {
			body.pagesToSetCompleted = toIdArray(additionalOptions.pagesToSetCompleted);
		}
	}

	return await lsRequest.call(ctx, 'PUT', `/members/${memberId}/course-progress/${courseInstanceId}`, { body });
};

const resetCourseProgress: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const courseInstanceId = ctx.getNodeParameter('courseId', i) as string;
	const setForWholeCourse = ctx.getNodeParameter('setForWholeCourse', i) as boolean;
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;

	const body: IDataObject = {};

	if (setForWholeCourse) {
		body.setForWholeCourse = true;
	} else {
		if (additionalOptions.modulesToResetProgressFor) {
			body.modulesToResetProgressFor = toIdArray(additionalOptions.modulesToResetProgressFor);
		}
		if (additionalOptions.lessonsToResetProgressFor) {
			body.lessonsToResetProgressFor = toIdArray(additionalOptions.lessonsToResetProgressFor);
		}
		if (additionalOptions.pagesToResetProgressFor) {
			body.pagesToResetProgressFor = toIdArray(additionalOptions.pagesToResetProgressFor);
		}
	}

	return await lsRequest.call(ctx, 'DELETE', `/members/${memberId}/course-progress/${courseInstanceId}`, { body });
};

const addToBundles: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const bundles = toIdArray(ctx.getNodeParameter('bundles', i));
	const add = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	const body: IDataObject = { bundles };
	const accessGivenAtOverride = isoDateTimeOption(ctx, i, 'Access Given At Override', add.accessGivenAtOverride);
	if (accessGivenAtOverride) body.accessGivenAtOverride = accessGivenAtOverride;

	const accessUntilOverride = isoDateTimeOption(ctx, i, 'Access Until Override', add.accessUntilOverride);
	if (add.unlimitedAccess === true) {
		body.unlimitedAccess = true;
	} else if (accessUntilOverride) {
		body.accessUntilOverride = accessUntilOverride;
	} else if (add.removeAccessUntilOverride === true) {
		body.accessUntilOverride = null;
	}

	const pauseUntil = isoDateTimeOption(ctx, i, 'Pause Until', add.pauseUntil);
	const pauseOptions = [pauseUntil, add.unlimitedPause === true, add.resumePause === true].filter(Boolean);
	if (pauseOptions.length > 1) {
		throw new NodeOperationError(ctx.getNode(), 'Pause Until, Unlimited Pause and Resume Pause cannot be combined', {
			itemIndex: i,
		});
	}
	if (pauseUntil) body.pauseUntil = pauseUntil;
	if (add.unlimitedPause === true) body.unlimitedPause = true;
	if (add.resumePause === true) body.resumePause = true;

	if (typeof add.disableAccessNotificationEmail === 'boolean') {
		body.disableAccessNotificationEmail = add.disableAccessNotificationEmail;
	}
	return lsRequest.call(ctx, 'PUT', `/members/${memberId}/bundles`, { body });
};

const removeFromBundles: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const bundleIds = toIdArray(ctx.getNodeParameter('bundleIds', i));
	return lsRequest.call(ctx, 'DELETE', `/members/${memberId}/bundles`, {
		body: { bundleIds },
	});
};

const getBundles: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/members/${memberId}/bundles`);
};

const getAiCredits: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/members/${encodeURIComponent(memberId)}/ai-credits`);
};

const findOrCreate: ExecuteHandler = async (ctx, i) => {
	const email = ctx.getNodeParameter('email', i) as string;

	try {
		return await lsRequest.call(ctx, 'GET', '/members/by-email', { qs: { email } });
	} catch (error: unknown) {
		const is404 = getHttpCode(error) === 404;

		if (!is404) {
			throw error as HttpErrorLike;
		}

		const firstName = ctx.getNodeParameter('firstName', i, '') as string;
		const lastName = ctx.getNodeParameter('lastName', i, '') as string;
		const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;

		const body: IDataObject = {
			email,
			firstName,
			lastName,
			...additionalOptions,
		};

		for (const k of Object.keys(body)) {
			if (body[k] === '' || body[k] == null) {
				delete body[k];
			}
		}

		return await lsRequest.call(ctx, 'POST', '/members', { body });
	}
};

export const memberHandlers = {
	getByEmail,
	getById,
	getAll,
	create,
	update,
	delete: del,
	activateDeactivate,
	addToCourses,
	removeFromCourses,
	getCourses,
	getCourseInfo,
	getCourseProgress,
	getModuleProgress,
	getLessonProgress,
	setCourseProgress,
	resetCourseProgress,
	addToBundles,
	removeFromBundles,
	getBundles,
	getAiCredits,
	findOrCreate,
};
