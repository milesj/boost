import { LogItem } from '../types';

export default function defaultFormatter(item: LogItem): string {
  let output = item.message;

  if (item.level !== 'log') {
    output = `${item.label} ${output}`;
  }

  return output;
}
