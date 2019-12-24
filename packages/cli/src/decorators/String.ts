import 'reflect-metadata';
import { SingleOption, DEFAULT_STRING_VALUE } from '@boost/args';
import createOptionFactory from '../metadata/createOptionFactory';
import { PartialConfig } from '../types';

export default function String(description: string, config?: PartialConfig<SingleOption<string>>) {
  // Property
  return createOptionFactory<SingleOption<string>>({
    ...config,
    default: DEFAULT_STRING_VALUE,
    description,
    type: 'string',
  });
}
