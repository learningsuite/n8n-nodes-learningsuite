import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';
import { toIdArray } from '../shared/parsing';

/**
 * Helpers
 */
type ExecuteContext = IExecuteFunctions;

type LegacyCourseContext = {
	courseId?: string;
	examModuleId?: string;
};

const getCol = (ctx: ExecuteContext, i: number, name: string): IDataObject => {
	try {
		const v = ctx.getNodeParameter(name, i, {}) as IDataObject | undefined;
		return v && typeof v === 'object' ? v : {};
	} catch {
		return {};
	}
};

const getStr = (ctx: ExecuteContext, i: number, name: string, def = ''): string => {
	try {
		const v = ctx.getNodeParameter(name, i, def) as string | undefined;
		return (v ?? def).toString().trim();
	} catch {
		return def;
	}
};

const getNum = (ctx: ExecuteContext, i: number, name: string, fallback = 0): number => {
	try {
		const v = ctx.getNodeParameter(name, i, fallback) as number | undefined;
		return Number.isFinite(v as number) ? (v as number) : fallback;
	} catch {
		return fallback;
	}
};

function buildDesiredFilter(ctx: ExecuteContext, i: number, eventType: string): IDataObject {
	const filter: IDataObject = {};

	switch (eventType) {
		// ---------------- Agent Action
		case 'agentAction.executed': {
			const col = getCol(ctx, i, 'additionalAgentActionExecuted') as {
				toolKey?: string;
				agentId?: string;
			};

			if (col?.toolKey) {
				filter.toolKey = String(col.toolKey);
			}
			if (col?.agentId) {
				filter.agentId = String(col.agentId);
			}
			break;
		}

		// ---------------- Community
		case 'communityPost.commented': {
			const col = getCol(ctx, i, 'additionalCommunityPostCommented');
			if (col?.areaId) filter.areaId = String(col.areaId);
			if (col?.forumId) filter.forumId = String(col.forumId);

			const ids = toIdArray(col?.mentionedUserIds ?? []);
			if (ids.length) filter.mentionedUserIds = ids;
			break;
		}

		case 'communityPost.created': {
			const col = getCol(ctx, i, 'additionalCommunityPostCreated');
			if (col?.areaId) filter.areaId = String(col.areaId);
			if (col?.forumId) filter.forumId = String(col.forumId);
			if (col?.publishStatus && col.publishStatus !== 'both') {
				filter.published = col.publishStatus === 'published'; // boolean
			}
			break;
		}

		case 'communityPost.moderated': {
			const col = getCol(ctx, i, 'additionalCommunityPostModerated');
			if (col?.areaId) filter.areaId = String(col.areaId);
			if (col?.forumId) filter.forumId = String(col.forumId);
			if (col?.approved && col.approved !== 'both') {
				filter.approved = col.approved === 'approved'; // boolean
			}
			break;
		}

		// ---------------- Login
		case 'login.new': {
			const col = getCol(ctx, i, 'additionalLoginNew') as { loginType?: string; userRoleId?: string };
			if (col?.loginType) {
				filter.loginType = String(col.loginType);
			}
			if (col?.userRoleId) {
				filter.userRoleId = String(col.userRoleId);
			}
			break;
		}

		// ---------------- Custom Popup
		case 'customPopup.interaction': {
			const col = getCol(ctx, i, 'additionalPopupInteraction') as {
				customPopupId?: string;
				interactionType?: string;
			};
			if (col?.customPopupId) {
				filter.customPopupId = String(col.customPopupId);
			}
			if (col?.interactionType) {
				filter.interactionType = String(col.interactionType);
			}
			break;
		}
		// ---------------- Custom Field Value Changed
		case 'customField.valueChanged': {
			const col = getCol(ctx, i, 'additionalCustomFieldValueChanged') as {
				customFieldCardId?: string;
			};

			if (col?.customFieldCardId) {
				filter.customFieldCardId = String(col.customFieldCardId);
			}
			break;
		}
		// ---------------- Progress
		case 'courseProgress.changed': {
			const aboveRaw = getNum(ctx, i, 'threshold', 0);
			filter.above = Math.max(0, Math.floor(aboveRaw));
			const col = getCol(ctx, i, 'additionalCourseProgress');
			if (col.courseId) filter.courseInstanceId = String(col.courseId);
			break;
		}

		// ---------------- Exams
		case 'exam.completed':
		case 'exam.graded': {
			const exam = getCol(ctx, i, 'additionalExamOptions') as {
				courseId?: string;
				examModuleId?: string;
			};
			const legacy = Object.keys(exam).length
				? undefined
				: (getCol(ctx, i, 'additionalFeedbackExam') as LegacyCourseContext);
			const c = (Object.keys(exam).length ? exam : legacy) || {};
			if (c?.courseId) filter.courseInstanceId = String(c.courseId);
			if (c?.examModuleId) filter.examModuleId = String(c.examModuleId);
			break;
		}

		// ---------------- Course
		case 'course.memberAdded':
		case 'course.updated': {
			const fb = getCol(ctx, i, 'additionalCourseOptions') as { courseId?: string };
			const legacy = Object.keys(fb).length
				? undefined
				: (getCol(ctx, i, 'additionalCourseOptions') as LegacyCourseContext);
			const c = (Object.keys(fb).length ? fb : legacy) || {};
			if (c?.courseId) filter.courseInstanceId = String(c.courseId);
			break;
		}

		// ---------------- Feedback
		case 'feedback.created': {
			const fb = getCol(ctx, i, 'additionalFeedbackOptions') as { courseId?: string };
			const legacy = Object.keys(fb).length
				? undefined
				: (getCol(ctx, i, 'additionalFeedbackExam') as LegacyCourseContext);
			const c = (Object.keys(fb).length ? fb : legacy) || {};
			if (c?.courseId) filter.courseInstanceId = String(c.courseId);
			break;
		}

		// ---------------- Access Request (required in UI)
		case 'accessRequest.created': {
			const courseId = getStr(ctx, i, 'courseId');
			if (courseId) filter.courseInstanceId = courseId;
			break;
		}

		// ---------------- Group Access
		case 'group.userAccessChanged': {
			const col = getCol(ctx, i, 'additionalGroupAccess');
			const actionType = getStr(ctx, i, 'actionType');
			if (actionType) filter.actionType = actionType; // 'added' | 'removed'
			if (col.groupId) filter.groupId = String(col.groupId);
			break;
		}

		// ---------------- Lesson Completed (cascading)
		case 'lesson.completed': {
			const col = getCol(ctx, i, 'additionalLessonCompleted');
			if (col.courseId) filter.courseInstanceId = String(col.courseId);
			if (col.moduleId) filter.moduleId = String(col.moduleId);
			if (col.lessonId) filter.lessonId = String(col.lessonId);
			break;
		}

		// ---------------- Submission (optional course)
		case 'submission.created': {
			const col = getCol(ctx, i, 'additionalSubmission');
			if (col.courseId) filter.courseInstanceId = String(col.courseId);
			break;
		}

		// ---------------- User Activation Status Changed
		case 'user.activationStatusChanged': {
			const col = getCol(ctx, i, 'additionalUserActivationStatus') as {
				action?: string;
				roleId?: string;
			};
			if (col?.action) filter.action = String(col.action);
			if (col?.roleId) filter.roleId = String(col.roleId);
			break;
		}

		default:
			break;
	}

	return filter;
}

// ---------------------------------------------------------
// Handlers
const getSubscriptions: ExecuteHandler = async (ctx) => lsRequest.call(ctx, 'GET', '/webhooks/subscription');

const getSubscription: ExecuteHandler = async (ctx, i) => {
	const subscriptionId = ctx.getNodeParameter('subscriptionId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/webhooks/subscription/${encodeURIComponent(subscriptionId)}`);
};

const createSubscription: ExecuteHandler = async (ctx, i) => {
	const hookUrl = ctx.getNodeParameter('hookUrl', i) as string;
	const eventType = ctx.getNodeParameter('eventType', i) as string;

	const filter = buildDesiredFilter(ctx, i, eventType) || {};

	const body: IDataObject = { hookUrl, type: eventType, filter };
	return await lsRequest.call(ctx, 'POST', '/webhooks/subscription', { body });
};

const updateSubscription: ExecuteHandler = async (ctx, i) => {
	const subscriptionId = ctx.getNodeParameter('subscriptionId', i) as string;
	const hookUrl = ctx.getNodeParameter('hookUrl', i) as string;
	const eventType = ctx.getNodeParameter('eventType', i) as string;

	const filter = buildDesiredFilter(ctx, i, eventType) || {};

	const body: IDataObject = { hookUrl, type: eventType, filter };
	return await lsRequest.call(ctx, 'PUT', `/webhooks/subscription/${encodeURIComponent(subscriptionId)}`, { body });
};

const deleteSubscription: ExecuteHandler = async (ctx, i) => {
	const subscriptionId = ctx.getNodeParameter('subscriptionId', i) as string;
	return await lsRequest.call(ctx, 'DELETE', `/webhooks/subscription/${encodeURIComponent(subscriptionId)}`);
};

const getSampleData: ExecuteHandler = async (ctx, i) => {
	const sampleDataType = ctx.getNodeParameter('sampleDataType', i) as string;

	let qs: IDataObject = {};

	switch (sampleDataType) {
		case 'agent-action-executed-events': {
			const col = ctx.getNodeParameter('additionalAgentActionExecutedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'progress-changed-events': {
			const col = ctx.getNodeParameter('additionalProgressChangedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'lesson-completed-events': {
			const col = ctx.getNodeParameter('additionalLessonCompletedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'new-login-events': {
			const col = ctx.getNodeParameter('additionalNewLoginSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'exam-completed-events': {
			const col = ctx.getNodeParameter('additionalExamCompletedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'exam-graded-events': {
			const col = ctx.getNodeParameter('additionalExamGradedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'custom-popup-interaction-events': {
			const col = ctx.getNodeParameter('additionalCustomPopupInteractionSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'community-post-created-events': {
			const col = ctx.getNodeParameter('additionalCommunityPostCreatedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'community-post-moderated-events': {
			const col = ctx.getNodeParameter('additionalCommunityPostModeratedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'community-post-commented-events': {
			const col = ctx.getNodeParameter('additionalCommunityPostCommentedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'group-user-access-changed-events': {
			const col = ctx.getNodeParameter('additionalGroupUserAccessChangedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'course-updated-events': {
			const col = ctx.getNodeParameter('additionalCourseUpdatedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'course-member-added-events': {
			const col = ctx.getNodeParameter('additionalCourseMemberAddedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'custom-field-value-changed': {
			const col = ctx.getNodeParameter('additionalCustomFieldValueChangedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}

		case 'user-activation-status-changed-events': {
			const col = ctx.getNodeParameter('additionalUserActivationStatusChangedSample', i, {}) as IDataObject;
			qs = col;
			break;
		}
	}

	return await lsRequest.call(ctx, 'GET', `/webhooks/sample-data/${encodeURIComponent(sampleDataType)}`, { qs });
};

export const webhookHandlers = {
	getSubscriptions,
	getSubscription,
	createSubscription,
	updateSubscription,
	deleteSubscription,
	getSampleData,
};
