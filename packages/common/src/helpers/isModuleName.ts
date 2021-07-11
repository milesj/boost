import { builtinModules } from 'module';
import { MODULE_NAME_PATTERN } from '../constants';
import { ModuleName } from '../types';

const RESERVED = new Set([...builtinModules, 'node_modules', 'favicon.ico']);

export default function isModuleName(name: ModuleName): boolean {
	if (RESERVED.has(name)) {
		return false;
	}

	return MODULE_NAME_PATTERN.test(name);
}
