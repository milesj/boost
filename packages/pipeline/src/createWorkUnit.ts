import { RuntimeError } from '@boost/common';
import Task from './Task';
import WorkUnit from './WorkUnit';
import { msg } from './constants';
import { Action } from './types';

/**
 * Create or return an executable work unit. Supports the following patterns:
 *
 * - A `Routine` instance.
 * - A `Task` instance.
 * - A custom `WorkUnit` instance.
 * - A title and function that returns a `Task` instance.
 */
export default function createWorkUnit<Input, Output = Input>(
  titleOrWorkUnit: string | WorkUnit<any, Input, Output>,
  action?: Action<any, Input, Output>,
  scope?: unknown,
): WorkUnit<any, Input, Output> {
  if (titleOrWorkUnit instanceof WorkUnit) {
    return titleOrWorkUnit;
  }

  if (typeof titleOrWorkUnit === 'string' && typeof action === 'function') {
    return new Task(titleOrWorkUnit, scope ? action.bind(scope) : action);
  }

  throw new RuntimeError('INVALID_WORK_UNIT_TYPE', msg('error:INVALID_WORK_UNIT_TYPE'));
}
