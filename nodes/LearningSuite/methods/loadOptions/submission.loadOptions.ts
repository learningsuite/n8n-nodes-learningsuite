// methods/loadOptions/submission.loadOptions.ts
import type { IDataObject, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { lsRequest } from '../../shared';
import { getScopedParam } from '../../shared/getScopedParam';
import { ensureArray } from './common';

type SubmissionRow = IDataObject & {
	submissionId?: string;
	createdAt?: string;
	fromUser?: IDataObject;
	lesson?: IDataObject;
	submission?: IDataObject;
	grading?: IDataObject;
};

function buildLabel(s: SubmissionRow): string {
	const user = s.fromUser ?? {};
	const member = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'Unknown';
	const task = s.submission?.taskName || s.lesson?.name || s.submission?.type || '';
	const date = typeof s.createdAt === 'string' ? s.createdAt.slice(0, 16).replace('T', ' ') : '';

	let status = 'ungraded';
	if (s.grading?.isGraded) {
		status = typeof s.grading.grade === 'number' ? `graded ${s.grading.grade}` : 'graded';
	}

	return [member, task, date].filter(Boolean).join(' — ') + ` (${status})`;
}

export async function submission_getSubmissions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const courseId = getScopedParam.call(this, 'courseId');
	if (!courseId) return [];

	const res = await lsRequest.call(this, 'GET', `/courses/${courseId}/submissions`, { qs: { limit: 100 } });
	const rows = ensureArray(res) as SubmissionRow[];

	return rows
		.map((s) => ({
			name: buildLabel(s),
			value: String(s.submissionId ?? s.submission?.submissionId ?? ''),
		}))
		.filter((o) => o.value);
}
