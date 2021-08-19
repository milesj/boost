import { LogItem, LogMetadata } from './types';

function formatMetadata(metadata: LogMetadata): string {
	const items: string[] = [];
	const keys = Object.keys(metadata).sort();

	keys.forEach((key) => {
		items.push(`${key}=${metadata[key]}`);
	});

	return `(${items.join(', ')})`;
}

/**
 * Format the item as if it's being logged to `console`.
 * _Only_ inclues the label and message.
 */
export function console(item: LogItem): string {
	let output = item.message;

	if (item.level !== 'log') {
		output = `${item.label} ${output}`;
	}

	return output;
}

/**
 * Format the item into a human-readable message with all item fields included.
 * This is the default format for most transports.
 */
export function debug(item: LogItem): string {
	return `[${item.time.toISOString()}] ${item.level.toUpperCase()} ${item.message} ${formatMetadata(
		{
			...item.metadata,
			host: item.host,
			name: item.name,
			pid: item.pid,
		},
	)}`;
}

/**
 * Format the entire item into JSON.
 */
export function json(item: LogItem): string {
	return JSON.stringify(item);
}

/**
 * Format the item using _only_ the message.
 */
export function message(item: LogItem): string {
	return item.message;
}
