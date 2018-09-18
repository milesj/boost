/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Reporter from '../Reporter';

export default class CIReporter extends Reporter {
  routineCount: number = 0;

  taskCount: number = 0;

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

  handleTask = () => {
    this.taskCount += 1;
  };

  handleTaskPass = () => {
    this.console.out!(this.style('-', 'success'));
  };

  handleTaskFail = () => {
    this.console.err!(this.style('-', 'failure'));
  };

  handleRoutine = () => {
    this.routineCount += 1;
    this.console.out!('+');
  };

  handleRoutinePass = () => {
    this.console.out!(this.style('+', 'success'));
  };

  handleRoutineFail = () => {
    this.console.err!(this.style('+', 'failure'));
  };

  handleStop = () => {
    const time = this.getElapsedTime(this.startTime, this.stopTime, false);

    this.console.out!(
      `\nRan ${this.routineCount} routine(s) and ${this.taskCount} task(s) in ${time}\n`,
    );
  };
}
