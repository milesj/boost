type BufferListener = (message: string) => void;

export default class LogBuffer {
  protected listener?: BufferListener;

  protected stream: NodeJS.WriteStream;

  constructor(stream: NodeJS.WriteStream) {
    this.stream = stream;
  }

  off() {
    delete this.listener;
  }

  on(listener: BufferListener) {
    this.listener = listener;
  }

  write = (message: string) => {
    if (this.listener) {
      this.listener(message);
    } else {
      this.stream.write(message);
    }
  };
}
