import 'reflect-metadata';
import { Flag as FlagConfig } from '@boost/args';
import createOptionFactory from '../metadata/createOptionFactory';
import { PartialConfig } from '../types';

export default function Flag(description: string, config?: PartialConfig<FlagConfig>) {
  // Property
  return createOptionFactory<FlagConfig>({
    ...config,
    description,
    type: 'boolean',
  });
}
