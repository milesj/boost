import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
	plugins: [
		{
			name: 'virtual-modules',
			resolveId(id) {
				if (id.startsWith('cjs-') || id.startsWith('esm-')) {
					return `virtual:${id}`;
				}
			},
		},
	],
	resolve: {
		conditions: ['node'],
	},
	test: {
		coverage: {
			provider: 'v8',
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
			thresholds: {
				branches: 90,
				functions: 99,
				lines: 99,
				statements: 99,
			},
		},
		setupFiles: [path.join(import.meta.dirname, './tests/setup.ts')],
		passWithNoTests: true,
	},
});
