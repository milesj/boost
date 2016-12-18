import Routine from '../src/Routine';
import { delayForParallel } from './helpers';

export class ParralelSubsRoutine extends Routine {
  execute(value) {
    return delayForParallel(this.name, value);
  }
}

export class ParralelTasksRoutine extends Routine {
  foo(value) {
    return delayForParallel('foo', value);
  }

  bar(value) {
    return delayForParallel('bar', value);
  }

  baz(value) {
    return delayForParallel('baz', value);
  }

  qux(value) {
    return delayForParallel('qux', value);
  }
}

export class SerializeSubsRoutine extends Routine {
  execute(value) {
    return {
      count: value.count * this.config.multiplier,
      key: value.key + this.name,
    };
  }
}

export class SerializeTasksRoutine extends Routine {
  duplicate(value) {
    return `${value}${value}`;
  }

  upperCase(value) {
    return value.toUpperCase();
  }

  lowerFirst(value) {
    return value.charAt(0).toLowerCase() + value.substring(1);
  }
}
