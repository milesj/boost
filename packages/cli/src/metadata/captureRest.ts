import 'reflect-metadata';
import { META_REST } from '../constants';

export default function captureRest(target: Object, property: string | symbol) {
  Reflect.defineMetadata(META_REST, property, target);
}
