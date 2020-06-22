import { createScopedError } from '@boost/internal';

const errors = {
  INVALID_RES_PATH: 'Resource path "%s" must be a directory.',
  REQ_MANUAL_LOCALE: 'A locale must be defined if auto-detection is disabled.',
  REQ_NAMESPACE: 'A namespace is required for translations.',
  REQ_RES_PATHS: 'At least 1 resource directory path is required.',
};

export type TranslateErrorCode = keyof typeof errors;

export default createScopedError<TranslateErrorCode>('TLT', 'TranslateError', errors);
