import 'reflect-metadata';
import { SingleOption } from '@boost/args';
import createOptionFactory from '../metadata/createOptionFactory';
import { PartialConfig } from '../types';

export default function Number(
  description: string,
  config?: PartialConfig<SingleOption<number>>,
): PropertyDecorator {
  return createOptionFactory<SingleOption<number>>({
    ...config,
    description,
    type: 'number',
  });
}
