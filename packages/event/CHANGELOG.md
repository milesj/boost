# 1.0.0

#### 🎉 Release

- Initial release!

#### 🚀 Updates

- Added `Event`, which synchronously fires listeners.
- Added `BailEvent`, which will bail the loop if a listener returns `false`.
- Added `ConcurrentEvent`, which asynchronously fires listeners and return a promise.
- Added `WaterfallEvent`, which passes the return value to each listener.

#### 🛠 Internals

- **[ts]** Refactored the type system to strictly and explicitly type all possible events,
  listeners, and their arguments.
