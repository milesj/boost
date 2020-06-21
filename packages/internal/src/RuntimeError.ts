import util from 'util';

interface MessageMap {
  [key: string]: string | undefined;
}

const messageCache = new Map<string, MessageMap>();

export default class RuntimeError extends Error {
  code: string;

  module: string;

  constructor(moduleName: string, code: string, params?: unknown[]) {
    super(RuntimeError.loadMessageForCode(moduleName, code, params));

    this.code = code;
    this.module = moduleName;
    this.name = 'RuntimeError';

    // If a message was not loaded, we are throwing an unknown error
    if (!this.message) {
      this.code = 'UNKNOWN_ERROR';
      this.message = RuntimeError.loadMessageForCode('internal', 'UNKNOWN_ERROR');
    }
  }

  static loadMessageForCode(moduleName: string, code: string, params: unknown[] = []): string {
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

    return data[code] ? util.format(data[code], ...params) : '';
  }
}
