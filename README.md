# Pipes v0.0.0
[![Build Status](https://travis-ci.org/milesj/pipes.svg?branch=master)](https://travis-ci.org/milesj/pipes)

Robust pipeline for creating build tools that separate logic into routines and tasks.

# Example

If Babel + Babili was created using this library, the implementation would look something like the following.

```js
Pipeline.fromConfig('./.babelrc')
  .pipe(new LocateRoutine('locate'))        // Glob initial files
  .pipe(new ResolveRoutine('resolve'))      // Resolve dependency lookups
  .pipe(new TransformRoutine('transform'))  // Apply transformations
  .pipe(new MinifyRoutine('minify'))        // Apply minification
  .pipe(new BundleRoutine('bundle', {       // Bundle and or output the files
    out: './lib',
  }))
  .execute('./src');
```
