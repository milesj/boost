import 'reflect-metadata';
import captureRest from '../metadata/captureRest';

export default function Rest(): PropertyDecorator {
  return captureRest;
}
