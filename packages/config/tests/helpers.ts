import { Path } from '@boost/common';

export function stubPath(part: string) {
  const path = process.platform === 'win32' ? new Path('D:', part) : new Path(part);

  // @ts-ignore
  path.stats = expect.any(Object);

  return path;
}
