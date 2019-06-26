import path from 'path';
import { createTranslator } from '@boost/translate';
import { Status } from './types';

export const msg = createTranslator(['error'], path.join(__dirname, '../res'));

export const STATUS_PENDING: Status = 'pending';
export const STATUS_RUNNING: Status = 'running';
export const STATUS_SKIPPED: Status = 'skipped';
export const STATUS_PASSED: Status = 'passed';
export const STATUS_FAILED: Status = 'failed';
