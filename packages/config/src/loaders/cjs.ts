import fs from 'fs';
import vm from 'vm';
import { Path } from '@boost/common';

export default function loadCjs<T>(path: Path): Promise<T> {
  return fs.promises.readFile(path.path(), 'utf8').then((data) => {
    const context = { module: { exports: {} } };

    vm.runInNewContext(data, context, path.path());

    return (context.module.exports as unknown) as T;
  });
}
