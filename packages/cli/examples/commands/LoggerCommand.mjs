import { createElement, useContext, useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { Command } from '../../mjs/index.mjs';
import { ProgramContext } from '../../mjs/react.mjs';
import random from '../random.mjs';

let timer;

function Logger() {
	const [count, setCount] = useState(0);
	const ctx = useContext(ProgramContext);

	useEffect(() => {
		console.warn('Initial render');

		function increment() {
			if (timer) {
				return;
			}

			setCount((prev) => prev + 1);

			const delay = random(3000, 250);

			console.info(`Sleeping for ${delay}ms`);
			ctx.log.error('Logging from context');

			timer = setTimeout(() => {
				timer = null;
				increment();
			}, delay);
		}

		increment();
	}, [ctx]);

	return createElement(Box, {}, createElement(Text, {}, `Rendered ${count} times`));
}

export default class LoggerCommand extends Command {
	static description = 'Test console logs effect on the render loop';

	static path = 'log';

	static category = 'test';

	run() {
		this.log.info('Rendering component');

		return createElement(Logger);
	}
}
