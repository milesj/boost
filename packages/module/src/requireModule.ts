import { interopModule } from './interopModule';
import { requireTSModule } from './requireTSModule';
import { ModuleLike, PathLike } from './types';
import { isTypeScript } from './typescript';

/**
 * Works in a similar fashion to the native NodeJS `require()`, but can also
 * import custom file types like TypeScript, and also returns a module shape
 * that aligns with the ESM loader specification.
 *
 * When loading custom file types, the extension in the file path is optional,
 * as NodeJS will iterate through each extension until a file is found.
 *
 * ```ts
 * import { requireModule } from '@boost/module';
 *
 * const result = requireModule('../../some/module');
 * ```
 *
 * Caveats and differences:
 *
 * - CommonJS files that utilize `module.exports` (default export) will have this
 *   value returned under a `default` property, instead of being returned directly.
 * - CommonJS files that utilize multiple `exports.<name>` (named exports) will
 *   have these values returned as properties on the result object, and will also
 *   be found on the `default` property.
 * - "ES module like" files will be returned as-is. These are files that are built
 *   with Babel or TypeScript and export an `__esModule` internal property.
 *
 * These changes align with `import()` and the ES module system. We made this
 * decision for consistency and reliability.
 */
export function requireModule<D = unknown, N extends object = {}>(
	path: PathLike,
	requirer: NodeRequire = require,
): ModuleLike<D, N> {
	const filePath = String(path);

	if (filePath.endsWith('.mjs') || filePath.endsWith('.mts')) {
		throw new Error(`Unable to require non-CommonJS file "${filePath}", use ESM imports instead.`);
	}

	if (isTypeScript(filePath)) {
		return requireTSModule(filePath, requirer);
	}

	return interopModule(requirer(filePath));
}
