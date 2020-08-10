let supportsTypeScript: boolean;

try {
  require('typescript');

  supportsTypeScript = true;
} catch {
  supportsTypeScript = false;
}

export default supportsTypeScript;
