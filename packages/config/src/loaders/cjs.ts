import vm from 'vm';
import { Path } from '@boost/common';
import readFile from '../helpers/readFile';

export default function loadCjs<T>(path: Path): Promise<T> {
  return readFile(path).then(data => {
    const context = { module: { exports: {} } };

    vm.runInNewContext(data, context, path.path());

    return (context.module.exports as unknown) as T;
  });
}
