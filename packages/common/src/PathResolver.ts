import { RuntimeError } from '@boost/internal';
import { PortablePath, Lookup, LookupType } from './types';
import Path from './Path';

export default class PathResolver {
  private lookups: Lookup[] = [];

  /**
   * Return a list of all lookup paths.
   */
  getLookupPaths(): string[] {
    return this.lookups.map(lookup => lookup.path.path());
  }

  /**
   * Add a file system path to look for, resolved against the defined current
   * working directory (or `process.cwd()` otherwise).
   */
  lookupFilePath(filePath: PortablePath, cwd?: PortablePath): this {
    this.lookups.push({
      path: Path.resolve(filePath, cwd),
      type: LookupType.FILE_SYSTEM,
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
   * Given a list of lookups, attempt to find the first real/existing path and
   * return a resolved absolute path. If a file system path, will check using `fs.exists`.
   * If a node module path, will check using `require.resolve`.
   */
  resolve(): {
    lookupPath: Path;
    resolvedPath: Path;
    type: LookupType;
  } {
    let resolvedPath: PortablePath = '';
    let resolvedLookup: Lookup | undefined;

    this.lookups.some(lookup => {
      // Check that the file exists on the file system.
      if (lookup.type === LookupType.FILE_SYSTEM) {
        if (lookup.path.exists()) {
          resolvedPath = lookup.path;
          resolvedLookup = lookup;
        } else {
          return false;
        }

        // Check that the module path exists using Node's module resolution.
        // The `require.resolve` function will throw an error if not found.
      } else if (lookup.type === LookupType.NODE_MODULE) {
        try {
          resolvedPath = require.resolve(lookup.path.path());
          resolvedLookup = lookup;
        } catch (error) {
          return false;
        }

        // This should never happen. How did you get here?
      } else {
        return false;
      }

      return true;
    });

    if (!resolvedPath || !resolvedLookup) {
      throw new RuntimeError('common', 'CM_PATH_RESOLVE_LOOKUPS', [
        this.lookups.map(lookup => `  - ${lookup.path} (${lookup.type})`).join('\n'),
      ]);
    }

    return {
      lookupPath: resolvedLookup.path,
      resolvedPath: Path.create(resolvedPath),
      type: resolvedLookup.type,
    };
  }

  /**
   * Like `resolve()` but only returns the resolved path.
   */
  resolvePath(): Path {
    return this.resolve().resolvedPath;
  }
}
