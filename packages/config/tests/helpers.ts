import { Path } from '@boost/common';

export function stubPath(part: string, wrap: boolean = true) {
  return process.platform === 'win32' && wrap && !part.match(/^[A-Z]:/u)
    ? new Path('D:', part)
    : new Path(part);
}
