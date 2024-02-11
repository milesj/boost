// https://nodejs.org/api/module.html#customization-hooks

import { register } from 'node:module';

register('./hook-typescript.mjs', import.meta.url);
