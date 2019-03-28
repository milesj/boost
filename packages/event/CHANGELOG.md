# 1.0.0

#### 🎉 Release

- Initial release!

#### 🚀 Updates

- Added `Emitter#once`, which only fires the listener one time.
- Added `Emitter#emitBail`, which will bail the loop if a listener returns `false`.
- Added `Emitter#emitParallel`, which will asynchronously fire listeners and return a promise.
- Added `Emitter#emitWaterfall`, which passes the return value to each listener.

#### 🛠 Internals

- **[ts]** Refactored the type system to strictly and explicitly type all possible events,
  listeners, and their arguments.
