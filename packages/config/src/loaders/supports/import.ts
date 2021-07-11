// Node < 13.3 doesn't support import() syntax
let supportsImport: boolean;

try {
	require('./importTest');

	supportsImport = true;
} catch {
	supportsImport = false;
}

export { supportsImport };
