import 'reflect-metadata';
import { Option } from '@boost/args';
import registerOption from './registerOption';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createOptionFactory<T extends Option<any>>(config: T) {
  return <O extends Object>(target: O, name: keyof O) => {
    console.log(name, target[name], Object.keys(target));

    registerOption(target, name, {
      ...config,
      // Inherit default value from class property if available
      default: target[name] ?? config.default,
    });
  };
}
