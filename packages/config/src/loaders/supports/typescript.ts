// eslint-disable-next-line import/no-mutable-exports
let supportsTypeScript: boolean;

try {
  // eslint-disable-next-line
  require('typescript');

  supportsTypeScript = true;
} catch {
  supportsTypeScript = false;
}

export default supportsTypeScript;
