import Emitter from '../src/Emitter';
import { Listener, WaterfallListener, ParallelListener } from '../src/types';

const emitter = new Emitter<{
  args: Listener<number, boolean, string>;
  'no.args': Listener;
  parallel: ParallelListener<object, unknown[]>;
  waterfall: WaterfallListener<string>;
}>();

// VALID

emitter.on('args', () => {});
emitter.on('args', (num, bool, str) => {});
emitter.on('no.args', () => false);
emitter.on('parallel', () => Promise.resolve());
emitter.on('waterfall', str => str);

emitter.emit('args', [123, true, 'abc']);
emitter.emitBail('no.args', []);
emitter.emitParallel('parallel', [{ test: true }, ['a', 'b', 'c']]);
emitter.emitWaterfall('waterfall', 'abc');

// INVALID

// Unknown event name
emitter.on('unknown.name', () => {});

// Extra arg
emitter.on('args', (num, bool, str, other) => {});

// Return not boolean or void
emitter.on('no.args', () => ({}));

// Return not promise
emitter.on('parallel', () => {});

// Missing args
emitter.emit('args', [123]);

// Invalid arg type
emitter.emit('args', [123, {}, 'abc']);

// Extra arg
emitter.emit('no.args', ['abc']);

// Empty args
emitter.emitParallel('parallel', []);

// Waterfall only 1 arg
emitter.emitWaterfall('waterfall', ['foo']);

// Args must be a string
emitter.once('waterfall', (value: number) => value);
