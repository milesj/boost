type BufferListener = (message: string) => void;

export class LogBuffer {
	protected listener?: BufferListener;

	protected stream: NodeJS.WriteStream;

	constructor(stream: NodeJS.WriteStream) {
		this.stream = stream;
	}

	on(listener: BufferListener) {
		this.listener = listener;

		return () => {
			delete this.listener;
		};
	}

	write = (message: string) => {
		if (this.listener) {
			this.listener(message);
		} else {
			this.stream.write(message);
		}
	};
}
