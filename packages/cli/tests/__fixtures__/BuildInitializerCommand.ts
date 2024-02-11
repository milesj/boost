import { Arg, Command, type GlobalOptions } from '../../src';

export interface BuildOptions extends GlobalOptions {
	dst: string;
	src: string;
}

export class BuildInitializerCommand extends Command<BuildOptions> {
	static override path = 'build';

	static override aliases = ['compile'];

	static override description = 'Build a project';

	static override usage = 'build -S ./src -D ./lib';

	static override category = 'build';

	// --dst, -D
	dst = Arg.string('Destination path', { short: 'D' });

	// --src, -S
	src = Arg.string('Source path', { default: './src', short: 'S' });

	async run() {
		await Promise.resolve();

		return 'Build!';
	}
}
