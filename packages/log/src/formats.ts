import { LogItem, LogMetadata } from './types';

function formatMetadata(metadata: LogMetadata): string {
	const items: string[] = [];
	const keys = Object.keys(metadata).sort();

	keys.forEach((key) => {
		items.push(`${key}=${metadata[key]}`);
	});

	return `(${items.join(', ')})`;
}

export function console(item: LogItem): string {
	let output = item.message;

	if (item.level !== 'log') {
		output = `${item.label} ${output}`;
	}

	return output;
}

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

export function json(item: LogItem): string {
	return JSON.stringify(item);
}

export function message(item: LogItem): string {
	return item.message;
}
