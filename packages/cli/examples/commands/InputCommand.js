const React = require('react');
const { Command } = require('../../cjs/index.cjs');
const { Input, PasswordInput, HiddenInput } = require('../../cjs/react.cjs');

module.exports = class InputCommand extends Command {
	static description = 'Test `Input` and related components';

	static path = 'input';

	static category = 'prompt';

	static options = {
		type: {
			choices: ['text', 'password', 'hidden'],
			default: 'text',
			type: 'string',
			description: 'Render a specific input type',
		},
	};

	async run() {
		let component = Input;
		let label = 'What is your name?';
		let placeholder = '<name>';

		if (this.type === 'password') {
			component = PasswordInput;
			label = 'What is your password?';
			placeholder = '<pass>';
		} else if (this.type === 'hidden') {
			component = HiddenInput;
			label = 'What is your secret key?';
			placeholder = '<key>';
		}

		return React.createElement(component, {
			label,
			placeholder,
			// onChange: (value) => {
			//   this.log('CHANGE', value);
			// },
			onSubmit: (value) => {
				this.log('SUBMIT', value);
			},
			validate:
				this.type === 'hidden'
					? undefined
					: (value) => {
							if (value.length < 3) {
								throw new Error('Must be at least 3 characters');
							}
					  },
		});
	}
};
