import { RuntimeError } from '@boost/internal';
import Task from './Task';
import WorkUnit from './WorkUnit';
import { Action } from './types';

/**
 * Create or return an executable work unit. Supports the following patterns:
 *
 * - A `Routine` instance.
 * - A `Task` instance.
 * - A custom `WorkUnit` instance.
 * - A title and function that returns a `Task` instance.
 */
export default function createWorkUnit<Input = unknown, Output = Input>(
  titleOrWorkUnit: string | WorkUnit<{}, Input, Output>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action?: Action<any, Input, Output>,
  scope?: unknown,
): WorkUnit<{}, Input, Output> {
  if (titleOrWorkUnit instanceof WorkUnit) {
    return titleOrWorkUnit;
  }

  if (typeof titleOrWorkUnit === 'string' && typeof action === 'function') {
    return new Task(titleOrWorkUnit, scope ? action.bind(scope) : action);
  }

  throw new RuntimeError('pipeline', 'PL_INVALID_WORK_UNIT');
}
