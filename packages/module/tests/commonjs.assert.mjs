// This just tests that the CommonJS tools can be imported
async function test() {
	await import('../cjs/index.cjs');
}

test().catch(console.error);
