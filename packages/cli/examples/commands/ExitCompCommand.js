const React = require('react');
const { Text } = require('ink');
const { Command } = require('../../cjs/index.cjs');
const { useProgram } = require('../../cjs/react.cjs');
const sleep = require('../sleep');

function Exit({ error }) {
	const { exit } = useProgram();

	React.useEffect(() => {
		if (error) {
			exit('Failed!');
		} else {
			exit();
		}
	}, [exit, error]);

	return React.createElement(Text, {}, 'Content');
}

module.exports = class ExitCompCommand extends Command {
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

		return React.createElement(Exit, { error: this.error });
	}
};
