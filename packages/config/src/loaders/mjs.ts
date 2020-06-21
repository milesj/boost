import { pathToFileURL } from 'url';
import { Path } from '@boost/common';

// Node < 13.3 doesn't support import() syntax
let supportsImport: boolean;

try {
  // eslint-disable-next-line
  require('./supports/import');

  supportsImport = true;
} catch {
  supportsImport = false;
}

export default async function loadMjs<T>(path: Path): Promise<T> {
  if (!supportsImport) {
    throw new Error(
      `Unable to use \`mjs\` loader. Native ECMAScript modules aren't supported by this platform. Found Node.js v${process.version}, requires v13.3.`,
    );
  }

  // import() expects URLs, not file paths.
  // https://github.com/nodejs/node/issues/31710
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const module = await import(pathToFileURL(path.path()).toString());

  return module.default;
}
