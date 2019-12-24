import 'reflect-metadata';
import { META_REST } from '../constants';

export default function Rest() {
  // Property
  return <T extends Object>(target: T, property: keyof T) => {
    Reflect.defineMetadata(META_REST, property, target);
  };
}
