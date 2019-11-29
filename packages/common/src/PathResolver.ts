import { RuntimeError } from '@boost/internal/src';
import { PortablePath } from './types';
import Path from './Path';

export enum LookupType {
  FILE_PATH,
  NODE_MODULE,
}

export interface Lookup {
  path: Path;
  type: LookupType;
}

export default class PathResolver {
  private lookups: Lookup[] = [];

  /**
   * Add a file system path to look for, resolved against the defined current
   * working directory (or `process.cwd()` otherwise).
   */
  lookupFilePath(filePath: PortablePath, cwd?: PortablePath): this {
    this.lookups.push({
      path: Path.resolve(filePath, cwd),
      type: LookupType.FILE_PATH,
    });

    return this;
  }

  /**
   * Add a Node.js module, either by name or relative path, to look for.
   */
  lookupNodeModule(modulePath: PortablePath): this {
    this.lookups.push({
      path: Path.create(modulePath),
      type: LookupType.NODE_MODULE,
    });

    return this;
  }

  /**
   * Given a list of lookup paths (either a file system path or a Node.js module path),
   * attempt to find the first real/existing path and return a resolved absolute path.
   */
  resolve(): Path {
    let resolvedPath: PortablePath = '';

    this.lookups.some(lookup => {
      // Check that the file exists on the file system.
      if (LookupType.FILE_PATH) {
        if (lookup.path.exists()) {
          resolvedPath = lookup.path;
        } else {
          return false;
        }

        // Check that the module path exists using Node's module resolution.
        // The `require.resolve` function will throw an error if not found.
      } else if (LookupType.NODE_MODULE) {
        try {
          resolvedPath = require.resolve(lookup.path.path());
        } catch {
          return false;
        }

        // This should never happen. How did you get here?
      } else {
        return false;
      }

      return true;
    });

    if (!resolvedPath) {
      throw new RuntimeError('common', 'CM_PATH_RESOLVE_LOOKUPS', [
        this.lookups.map(lookup => `  - ${lookup.path}`).join('\n'),
      ]);
    }

    return Path.create(resolvedPath);
  }
}
