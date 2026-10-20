export function toIdArray(input: unknown): string[] {
	if (Array.isArray(input)) return input.map((v) => String(v).trim()).filter(Boolean);
	if (typeof input === 'string')
		return input
			.split(',')
			.map((v) => v.trim())
			.filter(Boolean);
	if (input == null) return [];
	return [String(input).trim()].filter(Boolean);
}

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

/** Normalizes a date/time to the API's IsoDateTime format (time zone required). Returns undefined if unparsable. */
export function toIsoDateTime(input: unknown): string | undefined {
	const value = String(input ?? '').trim();
	if (!value) return undefined;
	if (ISO_DATE_TIME.test(value)) return value;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
