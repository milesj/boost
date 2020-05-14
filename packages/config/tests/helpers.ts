import { Path } from '@boost/common';

export function stubPath(part: string) {
  const path = new Path(part);

  // @ts-ignore
  path.stats = expect.any(Object);

  return path;
}
