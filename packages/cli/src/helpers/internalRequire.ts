import { createRequire } from 'module';

export const internalRequire = createRequire(import.meta.url);
