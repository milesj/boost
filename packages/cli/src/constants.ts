import path from 'path';
import { createTranslator } from '@boost/translate';
import { ExitCode, StreamType } from './types';

export const msg = createTranslator('cli', path.join(__dirname, '../res'));

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
export const VERSION_FORMAT = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/u;

export const EXIT_PASS: ExitCode = 0;
export const EXIT_FAIL: ExitCode = 1;

export const RESERVED_OPTIONS = [
  // Existing args
  'help',
  'locale',
  'rest',
  'version',
  // Class methods
  'bootstrap',
  'exit',
  'log',
  'register',
  'run',
];

export const STREAM_TYPES: StreamType[] = ['stderr', 'stdout'];
