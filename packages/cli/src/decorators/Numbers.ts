import 'reflect-metadata';
import { MultipleOption } from '@boost/args';
import createOptionFactory from '../metadata/createOptionFactory';
import { PartialConfig } from '../types';

export default function Numbers(
  description: string,
  config?: PartialConfig<MultipleOption<number[]>>,
): PropertyDecorator {
  return createOptionFactory<MultipleOption<number[]>>({
    ...config,
    default: [],
    description,
    multiple: true,
    type: 'number',
  });
}
