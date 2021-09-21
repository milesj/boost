import { Blueprint, Schemas } from '@boost/common/optimal';
import { Transport } from '../Transport';
import { TransportOptions, Writable } from '../types';

export interface StreamTransportOptions extends TransportOptions {
	/** The stream to pipe messages to. */
	stream: Writable;
}

export class StreamTransport extends Transport<StreamTransportOptions> {
	protected stream: Writable;

	constructor(options: StreamTransportOptions) {
		super(options);

		this.stream = options.stream;
	}

	override blueprint(schemas: Schemas): Blueprint<StreamTransportOptions> {
		const { func, shape } = schemas;

		return {
			...super.blueprint(schemas),
			stream: shape({
				write: func().required().notNullable(),
			}),
		};
	}

	/**
	 * Write a message to the configured stream.
	 */
	write(message: string) {
		this.stream.write(message);
	}
}
