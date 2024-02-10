#!/usr/bin/env bash

yarn run clean

# Packemon doesn't build packages in graph order,
# so we must do this manually!

packages=("internal" "module" "decorators" "event" "test-utils" "terminal" "common" "debug" "translate" "plugin" "pipeline" "log" "config" "args" "cli")

for package in ${packages[@]}; do
	echo "$package"
	cd "./packages/$package" || exit
	../../node_modules/.bin/packemon pack --addEngines --addExports --declaration
	cd ../..
done

