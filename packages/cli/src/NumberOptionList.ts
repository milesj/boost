import 'reflect-metadata';
import { MultipleOption } from '@boost/args';
import createOptionFactory from './metadata/createOptionFactory';
import { PartialConfig } from './types';

export default function NumberOptionList(
  description: string,
  config?: PartialConfig<MultipleOption<number[]>>,
) {
  return createOptionFactory<MultipleOption<number[]>>({
    ...config,
    description,
    multiple: true,
    type: 'number',
  });
}
