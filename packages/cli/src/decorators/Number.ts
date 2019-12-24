import 'reflect-metadata';
import { SingleOption, DEFAULT_NUMBER_VALUE } from '@boost/args';
import createOptionFactory from '../metadata/createOptionFactory';
import { PartialConfig } from '../types';

export default function Number(description: string, config?: PartialConfig<SingleOption<number>>) {
  // Property
  return createOptionFactory<SingleOption<number>>({
    ...config,
    default: DEFAULT_NUMBER_VALUE,
    description,
    type: 'number',
  });
}
