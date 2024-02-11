import { Command } from '../../mjs/index.mjs';
import sleep from '../sleep.mjs';

export default class ErrorCommand extends Command {
	static description = 'Test thrown errors render a failure state';

	static path = 'error';

	static category = 'test';

	async run() {
		console.log('Will throw an error in 3 seconds...');

		await sleep(3000);

		throw new Error('Custom thrown error!');
	}
}
