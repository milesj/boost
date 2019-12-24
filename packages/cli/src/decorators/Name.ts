import 'reflect-metadata';
import { RuntimeError } from '@boost/internal';
import { COMMAND_FORMAT } from '@boost/args';
import { META_NAME, META_DESCRIPTION } from '../constants';

export default function Name(name: string, description: string) {
  // Class
  return (target: Object) => {
    if (!name.match(COMMAND_FORMAT)) {
      throw new RuntimeError('args', 'AG_COMMAND_INVALID_FORMAT', [name]);
    }

    Reflect.defineMetadata(META_NAME, name, target);
    Reflect.defineMetadata(META_DESCRIPTION, description, target);
  };
}
