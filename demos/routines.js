const { Routine } = require('../lib');
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
      this.task(`Running task #${index}`, this.delayedTask).skip(index % 6 === 0);
    });
  }

  execute() {
    if (this.options.error) {
      throw new Error('Oops!');
    }

    return this.options.parallel ? this.parallelizeTasks() : this.serializeTasks();
  }

  delayedTask() {
    return new Promise(resolve => {
      setTimeout(resolve, random(750, 250));
    });
  }
}

exports.MultiTaskRoutine = MultiTaskRoutine;

class MultiSubRoutine extends Routine {
  bootstrap() {
    Array.from({ length: random() }, (v, i) => i).forEach(index => {
      this.pipe(new MultiTaskRoutine(`sub${index}`, `Routine #${index}`));
    });

    if (this.options.deep) {
      this.pipe(new MultiSubRoutine('deepsub', 'Deeply nested routine', { parallel: true }));
    }
  }

  execute() {
    return this.options.parallel ? this.parallelizeRoutines() : this.serializeRoutines();
  }
}

exports.MultiSubRoutine = MultiSubRoutine;
