import { interopModule } from './interopModule';
import { requireTSModule } from './requireTSModule';
import { ModuleLike, PathLike } from './types';
import { isTypeScript } from './typescript';

export function requireModule<D = unknown, N extends object = {}>(
	path: PathLike,
	requirer: NodeRequire = require,
): ModuleLike<D, N> {
	const filePath = String(path);

	if (filePath.endsWith('.mjs')) {
		throw new Error(`Unable to require non-CommonJS file "${filePath}", use ES imports instead.`);
	}

	if (isTypeScript(filePath)) {
		return requireTSModule(filePath, requirer);
	}

	return interopModule(requirer(filePath));
}
