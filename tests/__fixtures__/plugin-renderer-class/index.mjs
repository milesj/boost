import { Plugin } from '@boost/plugin';

class Renderer extends Plugin {
	blueprint({ string }) {
		return {
			value: string(),
		};
	}

	render() {
		return 'test';
	}
}

// Async
export default async function rendererPlugin(options) {
	await Promise.resolve();

	return new Renderer(options);
};
