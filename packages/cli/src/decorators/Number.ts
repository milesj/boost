import 'reflect-metadata';
import { SingleOption } from '@boost/args';
import createOptionFactory from '../metadata/createOptionFactory';
import { numberOptionBlueprint } from '../metadata/blueprints';
import { PartialConfig } from '../types';

export default function Number(description: string, config?: PartialConfig<SingleOption<number>>) {
  // Property
  return createOptionFactory<SingleOption<number>>(
    {
      ...config,
      description,
      type: 'number',
    },
    numberOptionBlueprint,
  );
}
