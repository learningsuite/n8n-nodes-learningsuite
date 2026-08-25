// methods/loadOptions/teamMember.loadOptions.ts
import type { IDataObject, ILoadOptionsFunctions } from 'n8n-workflow';
import { lsRequest } from '../../shared';
import { ensureArray } from './common';

type TeamMemberRow = IDataObject & {
	fullName?: string;
	firstName?: string;
	lastName?: string;
	roleId?: string | number;
	email?: string;
	id?: string | number;
	sid?: string | number;
	slug?: string | number;
};

function buildLabel(m: TeamMemberRow): string {
	const fullName = m?.fullName || [m?.firstName, m?.lastName].filter(Boolean).join(' ') || 'Unknown';
	const role = m?.roleId ?? '—';
	const email = m?.email ?? '';
	return [fullName, role, email].filter(Boolean).join(' - ');
}

export async function teamMember_getTeamMembersById(this: ILoadOptionsFunctions) {
	const res = await lsRequest.call(this, 'GET', '/team-members?limit=100');
	const rows = ensureArray(res) as TeamMemberRow[];
	return rows.map((m) => ({
		name: buildLabel(m),
		value: String(m?.id ?? m?.sid ?? m?.slug ?? 'Unknown'),
	}));
}

export async function teamMember_getTeamMembersByEmail(this: ILoadOptionsFunctions) {
	const res = await lsRequest.call(this, 'GET', '/team-members?limit=100');
	const rows = ensureArray(res) as TeamMemberRow[];
	return rows.map((m) => ({
		name: buildLabel(m),
		value: String(m?.email ?? 'Unknown'),
	}));
}
