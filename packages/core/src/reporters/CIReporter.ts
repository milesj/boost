/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Reporter from '../Reporter';
import Routine from '../Routine';
import Task from '../Task';

export default class CIReporter extends Reporter {
  routineCount: number = 0;

  taskCount: number = 0;

  bootstrap() {
    super.bootstrap();

    this.console
      .on('stop', this.handleStop)
      .on('task', this.handleTask)
      .on('routine', this.handleRoutine)
      .on('routine.skip', this.handleRoutineSkip)
      .on('routine.pass', this.handleRoutinePass)
      .on('routine.fail', this.handleRoutineFail);
  }

  handleRoutine = () => {
    this.routineCount += 1;
    this.console.out('.');
  };

  handleRoutineSkip = (routine: Routine<any, any>) => {
    this.console.out(this.style('.', 'warning'));
    this.console.out(`\n${routine.title}\n`);
  };

  handleRoutinePass = (routine: Routine<any, any>) => {
    this.console.out(this.style('.', 'success'));
    this.console.out(`\n${routine.title} (pass)\n`);
  };

  handleRoutineFail = (routine: Routine<any, any>) => {
    this.console.err(this.style('.', 'failure'));
    this.console.out(`\n${routine.title} (fail)\n`);
  };

  handleTask = (task: Task<any>) => {
    this.taskCount += 1;
    this.console.out(this.style('.', 'pending'));
    this.console.out(`\n${task.title} (fail)\n`);
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
