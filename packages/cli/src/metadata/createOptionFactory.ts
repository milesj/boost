import 'reflect-metadata';
import { Option } from '@boost/args';
import { Blueprint } from '@boost/common';
import registerOption from './registerOption';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createOptionFactory<O extends Option<any>>(
  config: O,
  blueprint: Blueprint<O>,
) {
  return <T extends Object>(target: T, name: keyof T) => {
    registerOption(target, name, config, blueprint);
  };
}
