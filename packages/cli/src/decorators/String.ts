import 'reflect-metadata';
import { SingleOption } from '@boost/args';
import createOptionFactory from '../metadata/createOptionFactory';
import { PartialConfig } from '../types';

export default function String(description: string, config?: PartialConfig<SingleOption<string>>) {
  // Property
  return createOptionFactory<SingleOption<string>>({
    ...config,
    description,
    type: 'string',
  });
}
