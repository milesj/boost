import 'reflect-metadata';
import { OptionConfigMap, Option } from '@boost/args';
import { META_OPTIONS } from '../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createOptionFactory<T extends Option<any>>(config: T) {
  return (target: Object, name: string) => {
    const options: OptionConfigMap = Reflect.getMetadata(META_OPTIONS, target) || {};

    options[name] = config;

    Reflect.defineMetadata(META_OPTIONS, options, target);
  };
}
