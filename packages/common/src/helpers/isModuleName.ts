import { builtinModules } from 'module';
import { MODULE_NAME_PATTERN } from '../constants';
import { ModuleID } from '../types';

const RESERVED = new Set([...builtinModules, 'node_modules', 'favicon.ico']);

/**
 * Returns `true` if a string is a valid Node module package name,
 * according to the rules defined in
 * [validate-npm-package-name](https://github.com/npm/validate-npm-package-name).
 * Will `return` false for native builtin modules, like `fs`, and for the old name format.
 *
 * ```ts
 * import { isModuleName } from '@boost/common';
 *
 * isModuleName('boost'); // true
 * isModuleName('@boost/common'); // true
 * isModuleName('fs'); // false
 * ```
 */
export function isModuleName(name: ModuleID): boolean {
	if (RESERVED.has(name)) {
		return false;
	}

	return MODULE_NAME_PATTERN.test(name);
}
