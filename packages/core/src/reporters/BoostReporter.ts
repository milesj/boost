/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Reporter from '../Reporter';
import Routine from '../Routine';
import Task from '../Task';

// TODO
// - i18n

const GAP = '  ';

export interface LineParts {
  prefix: string;
  status: string;
  suffix: string;
  title: string;
}

export default class BoostReporter extends Reporter {
  getLineParts(routine: Routine<any, any>, task: Task<any> | null = null): LineParts {
    const outputLevel = this.tool.config.output;
    const depth = this.calculateDepth(routine);
    const prefix = this.indent(depth * 2) + routine.key.toUpperCase() + GAP;
    const status = this.indent(prefix.length) + (task ? task.statusText : '');
    const suffix = [];
    const { tasks } = routine;

    if (routine.isSkipped()) {
      suffix.push(this.style('skipped', 'warning'));
    } else if (routine.hasFailed()) {
      suffix.push(this.style('failed', 'failure'));
    } else {
      if (tasks.length > 0) {
        suffix.push(`${this.calculateTaskCompletion(tasks)}/${tasks.length}`);
      }

      if (outputLevel >= 2) {
        suffix.push(this.getElapsedTime(routine.startTime, routine.stopTime));
      }
    }

    return {
      prefix,
      status,
      suffix: suffix.join(', '),
      title: routine.title,
    };
  }

  renderLines(routine: Routine<any, any>, task: Task<any> | null = null) {
    const outputLevel = this.tool.config.output;
    const { columns } = this.console.size();
    const { prefix, suffix, title, status } = this.getLineParts(routine, task);
    let routineLine = '';
    let taskLine = '';

    // Routine line
    routineLine += this.style(prefix, this.getColorType(routine), ['bold']);
    routineLine += this.console.truncate(title, columns - prefix.length - suffix.length);

    if (suffix && outputLevel >= 1) {
      routineLine += ' ';
      routineLine += this.style(`[${suffix}]`, 'pending');
    }

    routineLine += '\n';

    // Active task line
    if (status) {
      taskLine += this.console.truncate(this.style(status, 'pending'), columns);
      taskLine += '\n';
    }

    this.console.out(routineLine + taskLine);
  }
}
