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

build_pkg "./packages/core"
cd "$root" || exit

REGEX="/(core|theme)"

for pkg in ./packages/*; do
  if ! [[ "$pkg" =~ $REGEX ]]
  then
    build_pkg "$pkg"
  fi
done
