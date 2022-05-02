import * as typescript from './typescript';

export * from '../types';

/**
 * Load TypeScript files based on the ESM loader specification.
 * @link https://nodejs.org/api/esm.html#esm_loaders
 */
export { typescript };

// Since we only have 1 loader at the moment, just return it directly.
// Once we have multiple loaders, we can iterate through them as a whole.

export const { load, resolve } = typescript;
