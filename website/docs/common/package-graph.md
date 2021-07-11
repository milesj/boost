---
title: PackageGraph
---

Generate a dependency graph for a list of packages, based on their defined `dependencies` and
`peerDependencies`. To begin, instantiate an instance of `PackageGraph`, which accepts a list of
optional `package.json` objects as the first argument.

```ts
import { PackageGraph } from '@boost/common';

const graph = new PackageGraph([
	{
		name: '@boost/common',
		version: '1.2.3',
	},
	{
		name: '@boost/cli',
		version: '1.0.0',
		dependencies: {
			'@boost/common': '^1.0.0',
		},
	},
]);
```

Once all packages have been defined, we can resolve our graph into 1 of 3 formats.

```ts
const batch = graph.resolveBatchList();
const list = graph.resolveList();
const tree = graph.resolveTree();
```

> Will only resolve and return packages that have been defined. Will _not_ return non-defined
> packages found in `dependencies` and `peerDependencies`.

## API

### `addPackage`

> PackageGraph#addPackage(package: T): this

Add a package by name with an associated `package.json` object. Will map a dependency between the
package and its dependees found in `dependencies` and `peerDependencies`.

```ts
graph.addPackage({
	name: '@boost/plugin',
	version: '1.6.0',
	peerDependencies: {
		'@boost/common': '^1.0.0',
		'@boost/debug': '^1.0.0',
	},
});
```

### `addPackages`

> PackageGraph#addPackages(packages: T[]): this

Add multiple packages and map their dependencies.

```ts
graph.addPackages([
	{
		name: '@boost/plugin',
		version: '1.6.0',
	},
	{
		name: '@boost/debug',
		version: '1.2.0',
	},
]);
```

### `resolveBatchList`

> PackageGraph#resolveBatchList(): T[][]

Resolve the dependency graph and return a list of batched `package.json` objects (array of arrays)
in the order they are depended on.

```ts
graph.resolveBatchList().forEach((pkgs) => {
	pkgs.forEach((pkg) => {
		console.log(pkg.name);
	});
});
```

### `resolveList`

> PackageGraph#resolveList(): T[]

Resolve the dependency graph and return a list of all `package.json` objects in the order they are
depended on.

```ts
graph.resolveList().forEach((pkg) => {
	console.log(pkg.name);
});
```

### `resolveTree`

> PackageGraph#resolveTree(): PackageGraphTree<T\>

Resolve the dependency graph and return a tree of nodes for all `package.json` objects and their
dependency mappings.

```ts
graph.resolveTree().nodes.forEach((node) => {
	console.log(node.package.name);

	if (node.nodes) {
		// Dependents
	}
});
```
