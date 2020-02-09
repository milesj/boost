import 'reflect-metadata';
import { META_REST } from '../constants';

export default function Rest(): PropertyDecorator {
  return (target, property) => {
    Reflect.defineMetadata(META_REST, property, target);
  };
}
