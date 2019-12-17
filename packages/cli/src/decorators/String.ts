import 'reflect-metadata';
import { SingleOption } from '@boost/args';
import createOptionFactory from '../metadata/createOptionFactory';
import { PartialConfig } from '../types';

export default function String(description: string, config?: PartialConfig<SingleOption<string>>) {
  return createOptionFactory<SingleOption<string>>({
    ...config,
    default: '',
    description,
    type: 'string',
  });
}
