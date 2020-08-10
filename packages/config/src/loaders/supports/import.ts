// Node < 13.3 doesn't support import() syntax

// eslint-disable-next-line import/no-mutable-exports
let supportsImport: boolean;

try {
  // eslint-disable-next-line
  require('./importTest');

  supportsImport = true;
} catch {
  supportsImport = false;
}

export default supportsImport;
