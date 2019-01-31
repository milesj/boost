const { Routine } = require('../packages/core/lib');
const random = require('./random');

class DelayedRoutine extends Routine {
  blueprint({ number }) {
    return {
      delay: number(),
    };
  }

  execute() {
    return new Promise(resolve => {
      setTimeout(resolve, this.options.delay || random(2000, 1000));
    });
  }
}

exports.DelayedRoutine = DelayedRoutine;

class MultiTaskRoutine extends Routine {
  blueprint({ bool }) {
    return {
      error: bool(),
      exit: bool(),
      parallel: bool(),
    };
  }

  bootstrap() {
    Array.from({ length: random() }, (v, i) => i).forEach(index => {
      this.task(`Running task #${index + 1}`, this.delayedTask).skip(index % 6 === 0);
    });

    this.title += ` (${this.metadata.depth}:${this.metadata.index})`;
  }

  execute() {
    if (this.options.error) {
      throw new Error('Oops!');
    } else if (this.options.exit) {
      this.tool.exit('Force exit with a 0.', 0);
    }

    return this.options.parallel ? this.parallelizeTasks() : this.serializeTasks();
  }

  delayedTask() {
    return new Promise(resolve => {
      const time = random(750, 250);

      // this.tool.logLive(`This is a live message! ${time}`);

      setTimeout(resolve, time);
    });
  }
}

exports.MultiTaskRoutine = MultiTaskRoutine;

class MultiSubRoutine extends Routine {
  blueprint({ bool }) {
    return {
      deep: bool(),
      parallel: bool(),
    };
  }

  bootstrap() {
    Array.from({ length: random() }, (v, i) => i).forEach(index => {
      this.pipe(new MultiTaskRoutine(`sub ${index + 1}`, `Routine #${index + 1}`));
    });

    if (this.options.deep) {
      this.pipe(new MultiSubRoutine('deepsub', 'Deeply nested routine', { parallel: true }));
    }

    this.title += ` (${this.metadata.depth}:${this.metadata.index})`;
  }

  execute() {
    return this.options.parallel ? this.parallelizeRoutines() : this.serializeRoutines();
  }
}

exports.MultiSubRoutine = MultiSubRoutine;
