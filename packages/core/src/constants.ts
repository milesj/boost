import { Status } from './types';

export const APP_NAME_PATTERN = /^[a-z]{1}[-a-z0-9]+[a-z]{1}$/u;
export const CONFIG_NAME_PATTERN = /^[a-z]{1}[a-zA-Z0-9]+$/u;
export const EVENT_NAME_PATTERN = /^[-a-z.]+$/u;
export const MODULE_NAME_PATTERN = /^(@[-a-z]+\/)?[-a-z]+$/u;
export const PLUGIN_NAME_PATTERN = /^([a-z]+):[-a-z]+$/u;

export const STATUS_PENDING: Status = 'pending';
export const STATUS_RUNNING: Status = 'running';
export const STATUS_SKIPPED: Status = 'skipped';
export const STATUS_PASSED: Status = 'passed';
export const STATUS_FAILED: Status = 'failed';

// Chalk colors
// yellow = app name, module name
// cyan = file
// magenta = plugin name
