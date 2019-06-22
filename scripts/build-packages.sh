#!/usr/bin/env bash

root=$PWD

# We can't use Beemo to build our packages with TypeScript,
# as Beemo's CLI requires Boost itself.

build_pkg() {
  echo "$1"
  cp "$root/scripts/build-tsconfig.json" "$root/$1/tsconfig.json"
  cd "$root/$1" || exit
  node ../../node_modules/.bin/tsc
}

# Important order
build_pkg "./packages/common"
build_pkg "./packages/translate"
build_pkg "./packages/debug"
build_pkg "./packages/event"
build_pkg "./packages/log"

# Requires everything above
build_pkg "./packages/core"

# Low priority
build_pkg "./packages/reporter-nyan"
build_pkg "./packages/test-utils"
