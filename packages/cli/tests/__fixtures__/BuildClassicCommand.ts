import { Command, GlobalOptions, Options } from '../../src';

export interface BuildOptions extends GlobalOptions {
	dst: string;
	src: string;
}

export class BuildClassicCommand extends Command<BuildOptions> {
	static path = 'build';

	static aliases = ['compile'];

	static description = 'Build a project';

	static usage = 'build -S ./src -D ./lib';

	static category = 'build';

	static options: Options<BuildOptions> = {
		// --dst, -D
		dst: {
			description: 'Destination path',
			short: 'D',
			type: 'string',
		},
		// --src, -S
		src: {
			description: 'Source path',
			short: 'S',
			type: 'string',
		},
	};

	dst: string = '';

	src: string = './src';

	async run() {
		await Promise.resolve();

		return 'Build!';
	}
}
