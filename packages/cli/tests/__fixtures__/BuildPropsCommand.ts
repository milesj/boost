import { Command, type GlobalOptions, type Options } from '../../src';

export interface BuildOptions extends GlobalOptions {
	dst: string;
	src: string;
}

export class BuildPropsCommand extends Command<BuildOptions> {
	static override path = 'build';

	static override aliases = ['compile'];

	static override description = 'Build a project';

	static override usage = 'build -S ./src -D ./lib';

	static override category = 'build';

	static override options: Options<BuildOptions> = {
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
