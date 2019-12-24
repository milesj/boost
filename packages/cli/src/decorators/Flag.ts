import 'reflect-metadata';
import { Flag as FlagConfig, DEFAULT_BOOLEAN_VALUE } from '@boost/args';
import createOptionFactory from '../metadata/createOptionFactory';
import { PartialConfig } from '../types';

export default function Flag(description: string, config?: PartialConfig<FlagConfig>) {
  // Property
  return createOptionFactory<FlagConfig>({
    ...config,
    default: DEFAULT_BOOLEAN_VALUE,
    description,
    type: 'boolean',
  });
}
