import { Argv } from '../types';

export default function isArgvSize(argv: Argv, size: number): boolean {
  let list = [...argv];

  // Node process binaries are included
  if (list.length > 0 && list[0].endsWith('node')) {
    list = list.slice(2);
  }

  // Rest args are included
  list.some((arg, index) => {
    if (arg === '--') {
      list = list.slice(0, index);

      return true;
    }

    return false;
  });

  return list.length === size;
}
