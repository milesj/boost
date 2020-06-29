import { Predicates } from '@boost/common';
import Transport from './Transport';
import { TransportOptions, Loggable } from './types';

export interface StreamTransportOptions extends TransportOptions {
  stream: Loggable;
}

export default class StreamTransport extends Transport<StreamTransportOptions> {
  blueprint(preds: Predicates) {
    const { func, shape } = preds;

    return {
      ...this.sharedBlueprint(preds),
      stream: shape({
        write: func().required().notNullable(),
      }),
    };
  }

  write(message: string) {
    this.options.stream.write(message);
  }
}
