import { createRequire } from 'module';

export const internalRequire = createRequire(import.meta.url);

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
