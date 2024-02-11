import { createElement, useEffect } from 'react';
import { Text } from 'ink';
import { Command } from '../../mjs/index.mjs';
import { useProgram } from '../../mjs/react.mjs';
import sleep from '../sleep.mjs';

function Exit({ error }) {
	const { exit } = useProgram();

	useEffect(() => {
		if (error) {
			exit('Failed!');
		} else {
			exit();
		}
	}, [exit, error]);

	return createElement(Text, {}, 'Content');
}

export default class ExitCompCommand extends Command {
	static description = 'Test exiting the program (via component)';

	static path = 'exit-comp';

	static category = 'test';

	static options = {
		error: {
			description: 'Throw an error',
			type: 'boolean',
		},
	};

	async run() {
		console.log('Will render a component that exits in 1 second...');

		await sleep(1000);

		return createElement(Exit, { error: this.error });
	}
}
