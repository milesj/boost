import Emitter from '../src/Emitter';
import { Listener, WaterfallListener } from '../src/types';

const emitter = new Emitter<{
  args: Listener<[number, boolean, string]>;
  'args.func': Listener<[number, boolean, string?]>;
  'no.args': Listener;
  'no.args.func': Listener<[]>;
  'custom.return': Listener<[number], number>;
  waterfall: WaterfallListener<String>;

  // INVALID
  'must.be.array': number;
}>();

// VALID

emitter.on('args', () => {});
emitter.on('args', (num, bool, str) => {});
emitter.on('args.func', (num, bool, str) => true);
emitter.on('no.args', () => false);
emitter.on('no.args.func', () => {});
emitter.once('custom.return', (num: number) => num);

emitter.emit('args', [123, true, 'abc']);
emitter.emit('args.func', [123, true]);
emitter.emit('no.args', []);
emitter.emit('no.args.func', []);
emitter.emit('custom.return', [0]);

// INVALID

// Unknown event name
emitter.on('unknown.name', () => {});

// Extra arg
emitter.on('args', (num, bool, str, other) => {});

// Return not boolean or void
emitter.on('no.args', () => ({}));

// Return not number
emitter.on('custom.return', () => {});

// Missing args
emitter.emit('args', [123]);

// Invalid arg type
emitter.emit('args.func', [123, {}, 'abc']);

// Extra arg
emitter.emit('no.args', ['abc']);

// Args must be an array
emitter.once('must.be.array', 123);

// Args must be a string
emitter.once('waterfall', (value: number) => value);
