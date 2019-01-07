/* eslint-disable */

const { Routine } = require('../packages/core/lib');
const random = require('./random');

class DelayedRoutine extends Routine {
  execute() {
    return new Promise(resolve => {
      setTimeout(resolve, random(2000, 1000));
    });
  }
}

exports.DelayedRoutine = DelayedRoutine;

class MultiTaskRoutine extends Routine {
  bootstrap() {
    Array.from({ length: random() }, (v, i) => i).forEach(index => {
      this.task(`Running task #${index + 1}`, this.delayedTask).skip(index % 6 === 0);
    });

    this.title += ` (${this.metadata.depth}:${this.metadata.index})`;
  }

  execute() {
    if (this.options.error) {
      throw new Error('Oops!');
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
