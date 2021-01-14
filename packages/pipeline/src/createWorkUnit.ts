import PipelineError from './PipelineError';
import Task from './Task';
import { Action } from './types';
import WorkUnit from './WorkUnit';

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

  throw new PipelineError('WORK_UNKNOWN');
}
