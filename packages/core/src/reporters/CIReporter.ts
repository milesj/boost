/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Reporter from '../Reporter';
import { TaskInterface } from '../Task';
import { RoutineInterface } from '../Routine';

type TaskID = {
  id?: number;
};

export default class CIReporter extends Reporter<any> {
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

  handleTask = (task: TaskInterface & TaskID) => {
    // eslint-disable-next-line no-param-reassign
    task.id = this.taskID;
    this.taskID += 1;

    this.console.out(`[${task.id}] Running task: ${task.title}`);
  };

  handleTaskPass = (task: TaskInterface & TaskID) => {
    this.console.out(this.style(`[${task.id}] Passed`, 'success'));
  };

  handleTaskFail = (task: TaskInterface & TaskID, error: Error) => {
    this.console.err(this.style(`[${task.id}] Failed: ${error.message}`, 'failure'));
  };

  handleRoutine = (routine: RoutineInterface) => {
    this.console.out(`[${routine.key}] Running routine: ${routine.title}`);
  };

  handleRoutinePass = (routine: RoutineInterface) => {
    this.console.out(this.style(`[${routine.key}] Passed`, 'success'));
  };

  handleRoutineFail = (routine: RoutineInterface, error: Error) => {
    this.console.err(this.style(`[${routine.key}] Failed: ${error.message}`, 'failure'));
  };

  handleStop = () => {
    this.console.out(`Ran in ${this.getElapsedTime(this.startTime, this.stopTime, false)}`);
  };
}
