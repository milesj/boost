#!/usr/bin/env bash

# Packemon doesn't build packages in graph order,
# so we must do this manually!

packages=("internal" "module" "decorators" "debug" "event" "test-utils" "terminal" "common" "translate" "plugin" "pipeline" "log" "config" "args" "cli")

for package in ${packages[@]}; do
	echo "$package"
	cd "./packages/$package" || exit
	rm -rf {cjs,esm,mjs}
	../../node_modules/.bin/packemon pack --addEngines --addExports --declaration
	cd ../..
done

