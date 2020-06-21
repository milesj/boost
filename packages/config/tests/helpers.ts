/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Path } from '@boost/common';

export function stubPath(part: string, wrap: boolean = true) {
  const path = process.platform === 'win32' && wrap ? new Path('D:', part) : new Path(part);

  // @ts-expect-error
  path.stats = expect.any(Object);

  return path;
}
