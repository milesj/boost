interface MessageMap {
  [key: string]: string | undefined;
}

const messageCache: Map<string, MessageMap> = new Map();

export default class RuntimeError extends Error {
  code: string;

  module: string;

  constructor(moduleName: string, code: string) {
    super(RuntimeError.loadMessageForCode(moduleName, code));

    this.code = code;
    this.module = moduleName;
    this.name = 'RuntimeError';

    // If a message was not loaded, we are throwing an unknown error
    if (!this.message) {
      this.code = 'UNKNOWN_ERROR';
      this.message = RuntimeError.loadMessageForCode('internal', 'UNKNOWN_ERROR');
    }
  }

  static loadMessageForCode(moduleName: string, code: string): string {
    let data: MessageMap = {};

    if (messageCache.has(moduleName)) {
      data = messageCache.get(moduleName)!;
    } else {
      try {
        // eslint-disable-next-line
        data = require(`@boost/${moduleName}/res/errors.json`);
      } catch {
        // Do nothing
      }

      messageCache.set(moduleName, data);
    }

    return data[code] || '';
  }
}
