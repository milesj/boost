import { interopRequireModule } from '../internal/interopRequireModule';
import { PortablePath } from '../types';
import { requireTypedModule } from './requireTypedModule';

/**
 * Works in a similar fashion to the native NodeJS `require()`, but also handles
 * files built with Babel or TypeScript by properly returning the `default` export
 * if an "ES module", and also allowing the expected type to be defined.
 *
 * ```ts
 * import { requireModule } from '@boost/common';
 *
 * const result: ReturnShape = requireModule('../../some/module');
 * ```
 *
 * There are some caveats to be aware of in regards to default and named exports
 * in the file being required, they are:
 *
 * - When only a default export, the exported value is returned directly instead
 * of on an object with a `default` property.
 * - When only named exports, the returned value is an object with all the named
 * exports as properties on the object.
 * - When a default export and named exports together, the returned value is an
 * object with a `default` property, and an additional property for every named
 * export. It's best to stay away from this pattern.
 */
export function requireModule<T>(path: PortablePath): T {
	const filePath = String(path);

	if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
		return requireTypedModule(filePath);
	}

	return interopRequireModule(filePath) as T;
}
