# Subspace v0.0.0
[![Build Status](https://travis-ci.org/milesj/pipes.svg?branch=master)](https://travis-ci.org/milesj/pipes)

Robust pipeline for creating build tools that separate logic into routines and tasks.

# Example

If Babel + Babili was created using this library, the implementation would look something like the following.

```js
Pipeline.fromConfig('./.babelrc')
  .phase(new LocateRoutine('locate'))        // Glob initial files
  .phase(new ResolveRoutine('resolve'))      // Resolve dependency lookups
  .phase(new TransformRoutine('transform'))  // Apply transformations
  .phase(new MinifyRoutine('minify'))        // Apply minification
  .phase(new BundleRoutine('bundle', {       // Bundle and or output the files
    out: './lib',
  }))
  .execute('./src');
```
