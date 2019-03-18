import Emitter from '../src/Emitter';

const emitter = new Emitter<{
  args: [number, boolean, string?];
  'args.func': (num: number, bool: boolean, str?: string) => void;
  'no.args': [];
  'no.args.func': () => void;
  'custom.return': (num: number) => number;
}>();

// VALID

emitter.on('args', () => {});
emitter.on('args', (num, bool, str) => {});
emitter.on('args.func', (num, bool, str) => true);
emitter.on('no.args', () => false);
emitter.on('no.args.func', () => {});
emitter.once('custom.return', num => num);

emitter.emit('args', [123, true]);
emitter.emit('args.func', [123, true, 'abc']);
emitter.emit('no.args', []);
emitter.emit('no.args.func', []);
emitter.emit('custom.return', [0]);

// INVALID

// Unknown event name
emitter.on('unknown.name', () => {});

// Extra arg
emitter.on('args', (num, bool, str, other) => {});

// Return not boolean or void
emitter.on('no.args', () => {
  return {};
});

// Return not number
emitter.on('custom.return', () => {});

// Missing args
emitter.emit('args', [123]);

// Invalid arg type
emitter.emit('args.func', [123, {}, 'abc']);

// Extra arg
emitter.emit('no.args', ['abc']);
