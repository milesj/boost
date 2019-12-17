import 'reflect-metadata';
import { SingleOption } from '@boost/args';
import createOptionFactory from '../metadata/createOptionFactory';
import { PartialConfig } from '../types';

export default function Number(description: string, config?: PartialConfig<SingleOption<number>>) {
  return createOptionFactory<SingleOption<number>>({
    ...config,
    default: 0,
    description,
    type: 'number',
  });
}
