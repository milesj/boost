// This just tests that the CommonJS tools can be imported
async function test() {
	await import('../lib');
}

test().catch(console.error);
