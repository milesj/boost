// We keep this in a separate file so that in older node versions, where
// import() isn't supported, we can try/catch around the require() call
// when loading this file. Thanks to Babel for the implementation!

export async function testImport(filepath: string) {
	return import(filepath);
}
