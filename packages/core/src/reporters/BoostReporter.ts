/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Reporter from '../Reporter';
import Routine from '../Routine';

const BUFFER = 10;

export interface LineParts {
  prefix: string;
  suffix: string;
  title: string;
}

export default class BoostReporter extends Reporter {
  bootstrap() {
    super.bootstrap();

    this.console.on('routine', this.handleRoutine);
  }

  handleRoutine = (routine: Routine<any, any>) => {
    if (routine.metadata.depth !== 0) {
      return;
    }

    const output = this.console.createOutput(() => this.renderLines(routine)).enqueue();
    const handler = () => {
      output.enqueue(true);
    };

    routine.on('skip', handler);
    routine.on('pass', handler);
    routine.on('fail', handler);
  };

  getLineParts(routine: Routine<any, any>): LineParts {
    const { depth, order, startTime, stopTime } = routine.metadata;

    // Prefix
    const prefix = [];
    const orderProgress = `[${order}/${routine.parent!.routines.length}]`;

    if (depth === 0) {
      prefix.push(this.style(orderProgress, 'pending'), ' ');
    } else {
      prefix.push(this.indent(orderProgress.length), ' ', this.indent(depth));
    }

    prefix.push(this.style(routine.key.toUpperCase(), this.getColorType(routine), ['bold']), ' ');

    // Suffix
    const suffix = [];

    if (routine.isSkipped()) {
      suffix.push(this.style(this.tool.msg('app:cliSkipped'), 'warning'));
    } else if (routine.hasFailed()) {
      suffix.push(this.style(this.tool.msg('app:cliFailed'), 'failure'));
    } else if (routine.isRunning()) {
      if (!this.isCompactOutput()) {
        suffix.push(this.getElapsedTime(startTime, stopTime));
      }
    }

    return {
      prefix: prefix.join(''),
      suffix: suffix.join(', '),
      title: routine.title,
    };
  }

  renderLines(routine: Routine<any, any>): string {
    const { prefix, suffix, title } = this.getLineParts(routine);
    const { columns } = this.console.size();
    const prefixLength = this.console.strip(prefix).length;
    const suffixLength = this.console.strip(suffix).length;
    let output = '';

    // Routine line
    output += prefix;
    output += this.console.truncate(title, columns - prefixLength - suffixLength - BUFFER);

    if (suffix) {
      output += ' ';
      output += this.style(`(${suffix})`, 'pending');
    }

    output += '\n';

    // Active task lines
    routine.tasks.forEach(task => {
      if (task.isRunning()) {
        output += this.console.truncate(
          this.indent(prefixLength) +
            this.style(
              `${task.statusText || task.title} [${task.metadata.order}/${
                task.parent!.tasks.length
              }]`,
              'pending',
            ),
          columns - BUFFER,
        );
        output += '\n';
      }
    });

    // Only show sub-routines while still running or when verbose
    if (!routine.isRunning() && !this.isVerboseOutput()) {
      return output;
    }

    // Active routine lines
    routine.routines.forEach(sub => {
      output += this.renderLines(sub);
    });

    return output;
  }
}
