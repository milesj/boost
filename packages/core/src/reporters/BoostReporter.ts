import { instanceOf } from '@boost/common';
import Reporter from '../Reporter';
import Routine from '../Routine';
import Task from '../Task';

export interface LineParts {
  prefix: string;
  suffix: string;
  title: string;
}

export default class BoostReporter extends Reporter {
  blueprint() {
    return {};
  }

  bootstrap() {
    super.bootstrap();

    this.console.onRoutine.listen(this.handleRoutine);
  }

  handleRoutine = (routine: Routine<any, any>) => {
    if (routine.metadata.depth !== 0) {
      return;
    }

    const output = this.createOutput(() => this.renderLines(routine)).enqueue();
    const handler = () => {
      output.enqueue(true);
    };

    routine.onFail.listen(handler);
    routine.onPass.listen(handler);
    routine.onSkip.listen(handler);
  };

  getRoutineLineParts(routine: Routine<any, any>): LineParts {
    const { depth, startTime, stopTime } = routine.metadata;

    // Prefix
    const prefix = [];

    if (depth === 0) {
      if (this.getOutputLevel() >= Reporter.OUTPUT_NORMAL) {
        prefix.push(this.style(this.getStepProgress(routine, 'routines'), 'pending'), ' ');
      }
    } else {
      if (this.getOutputLevel() >= Reporter.OUTPUT_NORMAL) {
        prefix.push(
          this.indent(this.getStepProgress(this.getRootParent(routine), 'routines').length),
          ' ',
        );
      }

      prefix.push(this.indent(depth * 2));
    }

    prefix.push(this.style(routine.key.toUpperCase(), this.getColorType(routine), ['bold']));

    // Suffix
    const suffix = [];

    if (routine.isSkipped()) {
      suffix.push(this.style(this.tool.msg('app:cliSkipped'), 'warning'));
    } else if (routine.hasFailed()) {
      suffix.push(this.style(this.tool.msg('app:cliFailed'), 'failure'));
    } else if (routine.isRunning()) {
      if (this.getOutputLevel() >= Reporter.OUTPUT_NORMAL) {
        suffix.push(this.getElapsedTime(startTime, stopTime));
      }
    }

    return {
      prefix: prefix.join(''),
      suffix: suffix.join(', '),
      title: routine.title,
    };
  }

  getStepProgress(task: Task<any>, type: 'routines' | 'tasks'): string {
    if (!task.parent || !instanceOf(task.parent, Routine)) {
      return '';
    }

    return `[${task.metadata.index + 1}/${task.parent![type].length}]`;
  }

  getTaskLine(task: Task<any>): string {
    let line = this.strip(task.statusText || task.title).trim();

    if (this.getOutputLevel() >= Reporter.OUTPUT_NORMAL && !task.statusText) {
      line += ' ';
      line += this.getStepProgress(task, 'tasks');
    }

    return line;
  }

  renderLines(routine: Routine<any, any>): string {
    const { prefix, suffix, title } = this.getRoutineLineParts(routine);
    const { columns } = this.size();
    const prefixLength = this.strip(prefix).length;
    const suffixLength = this.strip(suffix).length;
    let output = '';

    // Routine line
    output += prefix;
    output += ' ';
    output += this.truncate(title, columns - prefixLength - suffixLength - Reporter.BUFFER);

    if (suffix) {
      output += ' ';
      output += this.style(`(${suffix})`, 'pending');
    }

    output += '\n';

    // Active task lines
    this.sortTasksByStartTime(Array.from(routine.tasks))
      .filter((task) => task.isRunning())
      .forEach((task) => {
        output += this.truncate(
          this.indent(prefixLength - routine.key.length + 2) +
            this.style(this.getTaskLine(task), 'pending'),
          columns - Reporter.BUFFER,
        );
        output += '\n';
      });

    // Only show sub-routines while still running or when verbose
    if (routine.isComplete()) {
      if (this.getOutputLevel() < Reporter.OUTPUT_VERBOSE) {
        return output;
      }
    } else if (routine.isPending()) {
      return output;
    }

    // Active routine lines
    this.sortTasksByStartTime(Array.from(routine.routines))
      .filter((task) => !task.isPending())
      .forEach((sub) => {
        output += this.renderLines(sub);
      });

    return output;
  }
}
