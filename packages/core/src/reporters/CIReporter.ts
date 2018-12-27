/**
 * @copyright   2017-2019, Miles Johnson
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
      .on('routine', this.handleRoutine)
      .on('routine.pass', this.handleRoutinePass)
      .on('routine.fail', this.handleRoutineFail);
  }

  handleRoutine = () => {
    this.routineCount += 1;
    this.console.out('.');
  };

  handleRoutinePass = () => {
    this.console.out(this.style('.', 'success'));
  };

  handleRoutineFail = () => {
    this.console.err(this.style('.', 'failure'));
  };

  handleTask = () => {
    this.taskCount += 1;
    this.console.out(this.style('.', 'pending'));
  };

  handleStop = () => {
    const msg = this.tool.msg('app:ciRanIn', {
      routineCount: this.routineCount,
      taskCount: this.taskCount,
      time: this.getElapsedTime(this.startTime, this.stopTime, false),
    });

    this.console.out(`\n${msg}\n`);
  };
}
