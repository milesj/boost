import { createElement, useEffect } from 'react';
import { Text } from 'ink';
import { Command } from '../../mjs/index.mjs';
import sleep from '../sleep.mjs';

function ThrowError() {
	useEffect(() => {
		throw new Error('Exit was triggered!');
	}, []);

	return createElement(Text, {}, 'Content');
}

export default class ErrorCompCommand extends Command {
	static description = 'Test thrown errors render a failure state (via component)';

	static path = 'error-comp';

	static category = 'test';

	async run() {
		console.log('Will render a component that throws an error in 1 second...');

		await sleep(1000);

		return createElement(ThrowError);
	}
}
