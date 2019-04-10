/* eslint-disable */

import { Event, BailEvent, ConcurrentEvent, WaterfallEvent } from '../src';

const foo = new Event<[number, string?]>('foo');
const bar = new BailEvent<[number, number, object]>('bar');
const baz = new ConcurrentEvent<unknown[]>('baz');
const qux = new WaterfallEvent<string>('qux');
const scope = new Event<[], 'a' | 'b' | 'c'>('scope');

// VALID
foo.listen(() => {});
foo.listen((num, str) => {});
foo.emit([123]);
foo.emit([123, 'abc']);

// INVALID
foo.listen((num, str, bool) => {});
foo.emit([true]);
foo.emit([123, 456]);
foo.emit([123, 'abc', true]);

// VALID
bar.listen(() => {});
bar.listen((num, str) => true);
bar.listen((num, str, obj) => false);
bar.emit([123, 456, {}]);

// INVALID
bar.listen(() => 123);
bar.emit([true]);
bar.emit([123, 'abc']);
bar.emit([123, 456, 'abc']);
const notBoolReturn: string = bar.emit([123, 456, {}]);

// VALID
baz.listen(() => Promise.resolve());
baz.listen((num, str) => Promise.reject());
baz.emit([]);
baz.emit([123, 456, {}]);

// INVALID
baz.listen(() => 123);
const notPromiseReturn: string = baz.emit(['abc']);

// VALID
qux.listen(() => 'abc');
qux.listen(str => str.toUpperCase());
qux.emit('qux');

// INVALID
qux.listen(() => 123);
qux.listen(() => {});
qux.emit(123);
qux.emit(['qux']);
const notStringReturn: number = qux.emit('abc');

// VALID
scope.listen(() => {});
scope.listen(() => {}, 'b');
scope.emit([]);
scope.emit([], 'c');

// INVALID
scope.listen(() => {}, 'z');
scope.emit([123]);
scope.emit([], 'y');
