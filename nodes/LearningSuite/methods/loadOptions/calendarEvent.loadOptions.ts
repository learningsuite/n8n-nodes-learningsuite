import type { IDataObject, ILoadOptionsFunctions } from 'n8n-workflow';
import { lsRequest } from '../../shared';
import { ensureArray } from './common';

type CalendarEventRow = IDataObject & {
	id?: string;
	name?: string;
	startDate?: string;
	startTime?: string;
};

export async function calendarEvent_getCalendarEvents(this: ILoadOptionsFunctions) {
	const res = await lsRequest.call(this, 'GET', '/calendar-events', { qs: { limit: 100 } });
	const rows = ensureArray(res) as CalendarEventRow[];

	return rows.map((e) => {
		const when = [e.startDate, e.startTime].filter(Boolean).join(' ');
		const label = e.name ? `${e.name}${when ? ` — ${when}` : ''}` : (e.id ?? 'Unknown');
		return { name: String(label), value: String(e.id ?? label) };
	});
}
