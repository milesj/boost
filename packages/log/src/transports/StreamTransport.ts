import { Predicates, Blueprint } from '@boost/common';
import Transport from '../Transport';
import { TransportOptions, Writable } from '../types';

export interface StreamTransportOptions extends TransportOptions {
  stream: Writable;
}

export default class StreamTransport extends Transport<StreamTransportOptions> {
  blueprint(preds: Predicates): Blueprint<StreamTransportOptions> {
    const { func, shape } = preds;

    return {
      ...super.blueprint(preds),
      stream: shape({
        write: func().required().notNullable(),
      }),
    };
  }

  write(message: string) {
    this.options.stream.write(message);
  }
}
