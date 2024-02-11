// This just tests that the CommonJS tools can be imported
async function test() {
	// eslint-disable-next-line import/no-useless-path-segments
	await import('../cjs/index.cjs');
}

test().catch(console.error);
