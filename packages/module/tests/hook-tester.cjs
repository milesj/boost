// Our CI runs many node versions, each with a different version
// of the hooks/loader API. Try and support them all!

const { spawnSync } = require('node:child_process');

const version = Number.parseFloat(process.version.slice(1));

if (version >= 20) {
	console.log(['--import', '@boost/module/register', './tests/hook.assert.mjs']);

	spawnSync('node', ['--import', '@boost/module/register', './tests/hook.assert.mjs'], {
		stdio: 'inherit',
	});
} else if (version >= 18) {
	console.log(['--loader', '@boost/module/hook-typescript', './tests/hook.assert.mjs']);

	spawnSync('node', ['--loader', '@boost/module/hook-typescript', './tests/hook.assert.mjs'], {
		stdio: 'inherit',
	});
} else {
	console.log([
		'--experimental-loader',
		'@boost/module/hook-typescript',
		'./tests/hook.assert.mjs',
	]);

	spawnSync(
		'node',
		['--experimental-loader', '@boost/module/hook-typescript', './tests/hook.assert.mjs'],
		{
			stdio: 'inherit',
		},
	);
}
