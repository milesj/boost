/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import rl from 'readline';
import chalk from 'chalk';
import { ConsoleInterface } from './Console';
import Reporter from './Reporter';
import { RoutineInterface } from './Routine';
import { TaskInterface } from './Task';

export default class DefaultReporter extends Reporter {
  depth: number = 0;

  keyLengths: { [depth: number]: number } = {};

  bootstrap(cli: ConsoleInterface) {
    super.bootstrap(cli);

    const maxLines = process.stdout.rows;

    cli.on('start', (event, routines: RoutineInterface[]) => {
      this.calculateKeyLengths(routines);
      this.hideCursor();
    });

    cli.on('stop', () => {
      this.showCursor();
    });

    cli.on('task', (event, task) => {
      // console.log(chalk.gray(task.title));
    });

    cli.on('task.pass', (event, task) => {
      // this.moveToStartOfLine(maxLines);
      // this.clearLine();
    });

    cli.on('task.fail', (event, task) => {
      // this.moveToStartOfLine(maxLines);
      // this.clearLine();
    });

    cli.on('routine', (event, routine: RoutineInterface) => {
      console.log(this.renderLine(routine));
      this.depth += 1;
    });

    cli.on('routine.pass', this.handleRoutineComplete);
    cli.on('routine.fail', this.handleRoutineComplete);
  }

  /**
   * Calculate the max string length for routine key's at every depth.
   */
  calculateKeyLengths(routines: RoutineInterface[], depth: number = 0) {
    this.keyLengths[depth] = routines.reduce((sum: number, routine: RoutineInterface) => {
      if (routine.subroutines.length > 0) {
        this.calculateKeyLengths(routine.subroutines, depth + 1);
      }

      return Math.max(routine.key.length, sum);
    }, 0);
  }

  /**
   * Calculate the current number of tasks that have completed.
   */
  calculateTaskCompletion(tasks: TaskInterface[]): number {
    return tasks.reduce((sum, task) => (task.hasPassed() || task.isSkipped() ? sum + 1 : sum), 0);
  }

  getLineTitle(routine: RoutineInterface): string {
    const { title, subtasks } = routine;
    let line = title;

    if (routine.isSkipped()) {
      line += chalk.yellow(' [skipped]');
    } else if (routine.hasFailed()) {
      line += chalk.red(' [failed]');
    }

    if (subtasks.length > 0) {
      line += chalk.gray(` [${this.calculateTaskCompletion(subtasks)}/${subtasks.length}]`);
    }

    return line;
  }

  /**
   * Return a specific color for each task status.
   */
  getStatusColor(task: TaskInterface): string {
    if (task.isSkipped()) {
      return 'yellow';
    } else if (task.hasPassed()) {
      return 'green';
    } else if (task.hasFailed()) {
      return 'red';
    }

    return 'white';
  }

  handleRoutineComplete = (event: any, routine: RoutineInterface) => {
    rl.clearLine(process.stdout, 0);
    rl.cursorTo(process.stdout, 0);

    console.log(this.renderLine(routine));
    this.depth -= 1;
  };

  renderLine(routine: RoutineInterface): string {
    // console.log('d=', this.depth);
    const key = routine.key.toUpperCase().padEnd(this.keyLengths[this.depth]);
    const status = chalk.reset.bold.black.bgKeyword(this.getStatusColor(routine))(` ${key} `);

    return `${status} ${this.getLineTitle(routine)}`;
  }
}
