/* eslint-disable import/no-default-export */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		{
			name: 'virtual-modules',
			resolveId(id) {
				if (id.startsWith('cjs-') || id.startsWith('esm-')) {
					return `virtual:${id}`;
				}

				return null;
			},
		},
	],
	resolve: {
		conditions: ['node'],
	},
	test: {
		coverage: {
			exclude: [
				'__fixtures__',
				'src/test.ts',
				// Annoying to test
				'cli/src/hooks',
				// Impossible to test
				'common/src/helpers/requireTypedModule.ts',
				'cli/src/middleware/checkNodeRequirement.ts',
				'cli/src/LogWriter.tsx',
				'cli/src/Wrapper.tsx',
				// Not supported by Jest/Babel
				'config/src/loaders/mjs.ts',
				'config/src/loaders/ts.ts',
				'config/src/loaders/supports',
				'decorators/src/helpers/isParam.ts',
				// Ignore these packages
				'internal/src',
				'module',
				'terminal/src',
				'test-utils/src',
				'website/src',
			],
			provider: 'v8',
			thresholds: {
				branches: 90,
				functions: 99,
				lines: 99,
				statements: 99,
			},
		},
		deps: {
			moduleDirectories: ['node_modules', 'tests/__mocks__'],
		},
		passWithNoTests: true,
		setupFiles: [path.join(path.dirname(fileURLToPath(import.meta.url)), './tests/setup.ts')],
	},
});
