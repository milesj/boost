/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable max-classes-per-file */

import Reporter from '../Reporter';
import Routine from '../Routine';
import Task from '../Task';
import Output from '../Output';

export default class BoostReporter extends Reporter {
  depth: number = 0;

  keyLength: number = 0;

  bootstrap() {
    this.console.on('start', this.handleStart).on('routine', this.handleRoutine);
  }

  /**
   * Calculate the max string length for routine key's at every depth.
   */
  calculateKeyLength(routines: Routine<any, any>[] = [], depth: number = 0): number {
    return routines.reduce(
      (sum: number, routine: Routine<any, any>) =>
        Math.max(
          sum,
          routine.key.length + depth,
          this.calculateKeyLength(routine.routines, depth + 1),
        ),
      0,
    );
  }

  /**
   * Return the task title with additional metadata.
   */
  // eslint-disable-next-line complexity
  getLineTitle(task: Task<any> | Routine<any, any>): { title: string; status: string } {
    const outputLevel = this.tool.config.output;
    const { tasks = [], routines = [] } = task as Routine<any, any>;
    const status = [];
    let { title } = task;

    if (task.isSkipped()) {
      status.push(this.style('skipped', 'warning'));
    } else if (task.hasFailed()) {
      status.push(this.style('failed', 'failure'));
    } else if (tasks.length > 0) {
      status.push(`${this.calculateTaskCompletion(tasks)}/${tasks.length}`);
    } else if (routines.length > 0) {
      status.push(`${this.calculateTaskCompletion(routines)}/${routines.length}`);
    }

    if (task instanceof Routine && !task.isSkipped() && outputLevel >= 2) {
      status.push(this.getElapsedTime(task.startTime, task.stopTime));
    } else if (task instanceof Task && task.statusText) {
      title = this.style(this.console.strip(task.statusText), 'pending');
    }

    return {
      status:
        status.length > 0 && outputLevel >= 1
          ? this.style(` [${status.join(', ')}]`, 'pending')
          : '',
      title,
    };
  }

  handleRoutine = (routine: Routine<any, any>) => {
    const output = new Output(this.renderLine(routine));

    const handleUpdate = () => {
      output.update(this.renderLine(routine));
      this.console.render(output);
    };

    routine.on('pass', handleUpdate);
    routine.on('fail', handleUpdate);

    this.console.render(output);
  };

  handleStart = (routines: Routine<any, any>[]) => {
    this.keyLength = this.calculateKeyLength(routines);
  };

  renderLine(routine: Routine<any, any>, task: Task<any> | null = null): string {
    const depth = this.calculateParentDepth(routine);
    const indent = depth * 2;
    const key =
      this.indent(depth) + (task ? '' : routine.key.toUpperCase()).padEnd(this.keyLength - depth);
    let output = '';

    // Status
    output += this.style(key, this.getColorType(routine), ['bold']);
    output += '  ';

    // Tree
    if (depth > 0) {
      if (task) {
        output += this.indent(indent);
      } else {
        output += this.indent(indent - 2);
        output += this.style('└', 'pending');
        output += ' ';
      }
    }

    // Title
    const { title, status } = this.getLineTitle(task || routine);

    output +=
      this.console.truncate(
        task ? this.style(title, 'pending') : title,
        this.console.size().columns - output.length - status.length,
      ) + status;

    return `${output}\n`;
  }
}
