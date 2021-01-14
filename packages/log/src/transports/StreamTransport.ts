import { Blueprint, Predicates } from '@boost/common';
import Transport from '../Transport';
import { TransportOptions, Writable } from '../types';

export interface StreamTransportOptions extends TransportOptions {
  stream: Writable;
}

export default class StreamTransport extends Transport<StreamTransportOptions> {
  protected stream: Writable;

  constructor(options: StreamTransportOptions) {
    super(options);

    this.stream = options.stream;
  }

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
    this.stream.write(message);
  }
}
