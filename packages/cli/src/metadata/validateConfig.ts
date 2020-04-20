import { optimal } from '@boost/common';
import { commandConstructorBlueprint } from './blueprints';
import { CommandStaticConfig } from '../types';

export default function validateConfig(
  name: string,
  config: Omit<CommandStaticConfig, 'options' | 'params'>,
) {
  optimal(config, commandConstructorBlueprint, {
    name,
    unknown: true,
  });
}
