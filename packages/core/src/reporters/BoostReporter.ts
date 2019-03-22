import Reporter from '../Reporter';
import Routine from '../Routine';
import Task from '../Task';
import instanceOf from '../helpers/instanceOf';

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

    const output = this.createOutput(() => this.renderLines(routine)).enqueue();
    const handler = () => {
      output.enqueue(true);
    };

    routine.on('skip', handler);
    routine.on('pass', handler);
    routine.on('fail', handler);
  };

  getRoutineLineParts(routine: Routine<any, any>): LineParts {
    const { depth, startTime, stopTime } = routine.metadata;

    // Prefix
    const prefix = [];

    if (depth === 0) {
      if (this.getOutputLevel() >= Reporter.OUTPUT_NORMAL) {
        prefix.push(this.style(this.getStepProgress(routine), 'pending'), ' ');
      }
    } else {
      if (this.getOutputLevel() >= Reporter.OUTPUT_NORMAL) {
        prefix.push(this.indent(this.getStepProgress(this.getRootParent(routine)).length), ' ');
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

  getStepProgress(task: Task<any>): string {
    if (!task.parent || !instanceOf(task, Routine)) {
      return '';
    }

    const limit = task.parent!.routines.size || task.parent!.tasks.size;

    return `[${task.metadata.index + 1}/${limit}]`;
  }

  getTaskLine(task: Task<any>): string {
    let line = this.strip(task.statusText || task.title).trim();

    if (this.getOutputLevel() >= Reporter.OUTPUT_NORMAL && !task.statusText) {
      line += ' ';
      line += this.getStepProgress(task);
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
      .filter(task => task.isRunning())
      .forEach(task => {
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
      .filter(task => !task.isPending())
      .forEach(sub => {
        output += this.renderLines(sub);
      });

    return output;
  }
}
