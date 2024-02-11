import { createElement } from 'react';
import { Command } from '../../mjs/index.mjs';
import { Confirm } from '../../mjs/react.mjs';

export default class ConfirmCommand extends Command {
	static description = 'Test `Confirm` component';

	static path = 'confirm';

	static category = 'prompt';

	static options = {};

	async run() {
		return createElement(Confirm, {
			label: 'Do you want to continue?',
			onSubmit: (value) => {
				this.log('SUBMIT', value);
			},
		});
	}
}
