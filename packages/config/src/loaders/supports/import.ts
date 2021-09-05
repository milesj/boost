import { internalRequire } from '@boost/internal';

// Node < 13.3 doesn't support import() syntax
let supportsImport: boolean;

try {
	// Is this correct???
	internalRequire('./importTest');

	supportsImport = true;
} catch {
	supportsImport = false;
}

export { supportsImport };
