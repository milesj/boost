# Boost
[![Build Status](https://travis-ci.org/milesj/boost.svg?branch=master)](https://travis-ci.org/milesj/boost)

Robust pipeline for creating build tools that separate logic into routines and tasks.

# Example

If Babel + Babili was created using this library, the implementation would look something like the following.

```js
(new Pipeline('babel', require('./.babelrc')))
  .pipe(new LocateRoutine('locate'))        // Glob initial files
  .pipe(new ResolveRoutine('resolve'))      // Resolve dependency lookups
  .pipe(new TransformRoutine('transform'))  // Apply transformations
  .pipe(new MinifyRoutine('minify'))        // Apply minification
  .pipe(new BundleRoutine('bundle', {       // Bundle and or output the files
    out: './lib',
  }))
  .run('./src');
```

# Lifecycle

```
app
  -> define command
    -> add metadata
    -> add routines
    -> run command
      -> init tool
        -> load configuration
        -> load plugins
        -> load UI
      -> init pipeline
        -> set tool
        -> set routines
        -> configure routines
        -> run pipeline
```
