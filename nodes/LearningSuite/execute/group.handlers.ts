import type { IDataObject } from 'n8n-workflow';
import { lsRequest, toIdArray } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getAll: ExecuteHandler = async (ctx, i) => {
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	const qs: IDataObject = {};
	if (additionalOptions.includeUsers) qs.includeUsers = additionalOptions.includeUsers as boolean;
	return await lsRequest.call(ctx, 'GET', '/groups', { qs });
};

const create: ExecuteHandler = async (ctx, i) => {
	const groupName = ctx.getNodeParameter('groupName', i) as string;
	return await lsRequest.call(ctx, 'POST', '/groups', { body: { name: groupName } });
};

const deleteGroup: ExecuteHandler = async (ctx, i) => {
	const groupId = ctx.getNodeParameter('groupId', i) as string;
	return await lsRequest.call(ctx, 'DELETE', `/group/${groupId}`);
};

const findByName: ExecuteHandler = async (ctx, i) => {
	const groupName = ctx.getNodeParameter('groupName', i) as string;
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	const qs: IDataObject = { name: groupName };
	if (additionalOptions.includeUsers) qs.includeUsers = additionalOptions.includeUsers as boolean;
	return await lsRequest.call(ctx, 'GET', '/groups/find-by-name', { qs });
};

const findOrCreate: ExecuteHandler = async (ctx, i) => {
	const groupName = ctx.getNodeParameter('groupName', i) as string;
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	const qs: IDataObject = { name: groupName };
	if (additionalOptions.includeUsers) qs.includeUsers = additionalOptions.includeUsers as boolean;
	try {
		const found = await lsRequest.call(ctx, 'GET', '/groups/find-by-name', { qs });
		if (Array.isArray(found) && found.length > 0) return found[0];
		return await lsRequest.call(ctx, 'POST', '/groups', { body: { name: groupName } });
	} catch {
		return await lsRequest.call(ctx, 'POST', '/groups', { body: { name: groupName } });
	}
};

const addMembers: ExecuteHandler = async (ctx, i) => {
	const userIds = toIdArray(ctx.getNodeParameter('userIds', i));
	const groupIds = toIdArray(ctx.getNodeParameter('groupIds', i));
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	return await lsRequest.call(ctx, 'PUT', '/add-members-to-groups', {
		body: { userIds, groupIds, ...additionalOptions },
	});
};

const removeMembers: ExecuteHandler = async (ctx, i) => {
	const userIds = toIdArray(ctx.getNodeParameter('userIds', i));
	const groupIds = toIdArray(ctx.getNodeParameter('groupIds', i));
	return await lsRequest.call(ctx, 'DELETE', '/remove-members-from-groups', { body: { userIds, groupIds } });
};

const getById: ExecuteHandler = async (ctx, i) => {
	const groupId = ctx.getNodeParameter('groupId', i) as string;
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	const qs: IDataObject = {};
	if (additionalOptions.includeUsers) qs.includeUsers = additionalOptions.includeUsers as boolean;
	return await lsRequest.call(ctx, 'GET', `/groups/${groupId}`, { qs });
};

const getCourses: ExecuteHandler = async (ctx, i) => {
	const groupId = ctx.getNodeParameter('groupId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/group/${groupId}/courses`);
};

const addCourses: ExecuteHandler = async (ctx, i) => {
	const groupId = ctx.getNodeParameter('groupId', i) as string;
	const courseIds = toIdArray(ctx.getNodeParameter('courseIds', i));
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	return await lsRequest.call(ctx, 'PUT', `/group/${groupId}/courses`, { body: { courseIds, ...additionalOptions } });
};

const removeCourses: ExecuteHandler = async (ctx, i) => {
	const groupId = ctx.getNodeParameter('groupId', i) as string;
	const courseIds = toIdArray(ctx.getNodeParameter('courseIds', i));
	return await lsRequest.call(ctx, 'DELETE', `/group/${groupId}/courses`, { body: { courseIds } });
};

const addBundles: ExecuteHandler = async (ctx, i) => {
	const groupId = ctx.getNodeParameter('groupId', i) as string;
	const bundleIds = toIdArray(ctx.getNodeParameter('bundleIds', i));
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	return await lsRequest.call(ctx, 'PUT', `/group/${groupId}/bundles`, { body: { bundleIds, ...additionalOptions } });
};

const addMembersSummary: ExecuteHandler = async (ctx, i) => {
	const userIds = toIdArray(ctx.getNodeParameter('userIds', i));
	const groupIds = toIdArray(ctx.getNodeParameter('groupIds', i));
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	return await lsRequest.call(ctx, 'PUT', '/add-members-to-groups-summary', {
		body: { userIds, groupIds, ...additionalOptions },
	});
};

export const groupHandlers = {
	getAll,
	create,
	delete: deleteGroup,
	findByName,
	findOrCreate,
	getById,
	addMembers,
	removeMembers,
	getCourses,
	addCourses,
	removeCourses,
	addBundles,
	addMembersSummary,
};
