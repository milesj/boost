import { MultipleOption } from '@boost/args';
import createOptionDecorator from '../metadata/createOptionDecorator';
import { PartialConfig } from '../types';

export default function Numbers(
  description: string,
  config?: PartialConfig<MultipleOption<number[]>>,
): PropertyDecorator {
  return createOptionDecorator<MultipleOption<number[]>>({
    ...config,
    default: [],
    description,
    multiple: true,
    type: 'number',
  });
}
