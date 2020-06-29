import { LogItem } from './types';

export function console(item: LogItem): string {
  let output = item.message;

  if (item.level !== 'log') {
    output = `${item.label} ${output}`;
  }

  return output;
}

export function debug(item: LogItem): string {
  return `[${item.time.toISOString()}] ${item.level.toUpperCase()} ${item.message} (name=${
    item.name
  }, host=${item.host}, pid=${item.pid})`;
}

export function json(item: LogItem): string {
  return JSON.stringify(item);
}

export function message(item: LogItem): string {
  return item.message;
}
