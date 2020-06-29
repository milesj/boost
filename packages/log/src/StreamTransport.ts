import { Predicates } from '@boost/common';
import Transport from './Transport';
import { TransportOptions, Writable } from './types';

export interface StreamTransportOptions extends TransportOptions {
  stream: Writable;
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
