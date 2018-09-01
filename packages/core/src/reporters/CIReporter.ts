/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import chalk from 'chalk';
import Reporter from '../Reporter';
import Task from '../Task';
import Routine from '../Routine';
import { Color } from '../types';

const COLORS: Color[] = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'];

export default class CIReporter extends Reporter {
  colorIndex: number = -1;

  ids: Map<Task<any>, number> = new Map();

  taskID: number = 0;

  bootstrap() {
    super.bootstrap();

    this.console
      .on('stop', this.handleStop)
      .on('task', this.handleTask)
      .on('task.pass', this.handleTaskPass)
      .on('task.fail', this.handleTaskFail)
      .on('routine', this.handleRoutine)
      .on('routine.pass', this.handleRoutinePass)
      .on('routine.fail', this.handleRoutineFail);
  }

  handleTask = (task: Task<any>) => {
    this.console.out(
      `${this.cycleStyle(`[${this.getTaskID(task)}]`)} Running task: ${task.title}\n`,
    );
  };

  handleTaskPass = (task: Task<any>) => {
    this.console.out(
      `${this.cycleStyle(`[${this.getTaskID(task)}]`)} ${this.style('Passed', 'success')}\n`,
    );
  };

  handleTaskFail = (task: Task<any>, error: Error) => {
    this.console.err(
      `${this.cycleStyle(`[${this.getTaskID(task)}]`)} ${this.style('Failed:', 'failure')} ${
        error.message
      }\n`,
    );
  };

  handleRoutine = (routine: Routine<any>) => {
    this.console.out(`${this.cycleStyle(`[${routine.key}]`)} Running routine: ${routine.title}\n`);
  };

  handleRoutinePass = (routine: Routine<any>) => {
    this.console.out(`${this.cycleStyle(`[${routine.key}]`)} ${this.style('Passed', 'success')}\n`);
  };

  handleRoutineFail = (routine: Routine<any>, error: Error) => {
    this.console.err(
      `${this.cycleStyle(`[${routine.key}]`)} ${this.style('Failed:', 'failure')} ${
        error.message
      }\n`,
    );
  };

  handleStop = () => {
    this.console.out(`Ran in ${this.getElapsedTime(this.startTime, this.stopTime, false)}\n`);
  };

  getTaskID(task: Task<any>): number {
    let id;

    if (this.ids.has(task)) {
      id = this.ids.get(task)!;
    } else {
      id = this.taskID;
      this.taskID += 1;
    }

    return id;
  }

  cycleStyle(message: string): string {
    this.colorIndex += 1;

    if (this.colorIndex === COLORS.length) {
      this.colorIndex = 0;
    }

    return chalk[COLORS[this.colorIndex]](message);
  }
}
