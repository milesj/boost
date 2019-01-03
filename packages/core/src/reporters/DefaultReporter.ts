/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Reporter from '../Reporter';
import Routine from '../Routine';
import Task from '../Task';

export type Line = {
  depth: number;
  routine: Routine<any, any>;
  tasks: Task<any>[];
};

export default class DefaultReporter extends Reporter<Line> {
  depth: number = 0;

  keyLength: number = 0;

  bootstrap() {
    super.bootstrap();

    this.console
      .on('start', this.handleStart)
      .on('task', this.handleTask)
      .on('task.pass', this.handleTaskComplete)
      .on('task.fail', this.handleTaskComplete)
      .on('routine', this.handleRoutine)
      .on('routine.pass', this.handleRoutineComplete)
      .on('routine.fail', this.handleRoutineComplete)
      .on('command.data', this.handleCommand)
      .on('render', this.handleRender);
  }

  handleCommand = () => {
    this.console.render();
  };

  handleTask = (task: Task<any>) => {
    const line = this.findLine(row => row.routine === task.parent);

    if (line) {
      line.tasks.push(task);
    }

    this.console.render();
  };

  handleTaskComplete = (task: Task<any>) => {
    const line = this.findLine(row => row.routine === task.parent);

    if (line) {
      line.tasks = line.tasks.filter(t => t !== task);
    }

    this.console.render();
  };

  handleRender = () => {
    this.lines.forEach(({ routine, tasks, depth }) => {
      this.renderLine(routine, null, depth);

      tasks.forEach(task => {
        this.renderLine(routine, task, depth);
      });
    });
  };

  handleRoutine = (routine: Routine<any, any>, value: any, wasParallel: boolean) => {
    this.addLine({
      depth: this.depth,
      routine,
      tasks: [],
    });

    this.console.render();

    if (!wasParallel) {
      this.depth += 1;
    }
  };

  handleRoutineComplete = (routine: Routine<any, any>, result: any, wasParallel: boolean) => {
    if (!wasParallel) {
      this.depth -= 1;
    }

    if (this.depth > 0 && this.tool.config.output < 3) {
      this.removeLine(line => line.routine === routine);
    }

    this.console.render();
  };

  renderLine(routine: Routine<any, any>, task: Task<any> | null, depth: number) {
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

    this.console.out(output, 1);
  }
}
