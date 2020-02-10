import { SingleOption } from '@boost/args';
import createOptionDecorator from '../metadata/createOptionDecorator';
import { PartialConfig } from '../types';

export default function Number(
  description: string,
  config?: PartialConfig<SingleOption<number>>,
): PropertyDecorator {
  return createOptionDecorator<SingleOption<number>>({
    ...config,
    description,
    type: 'number',
  });
}
