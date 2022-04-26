const { MultiSelect } = require('../../cjs/react.cjs');
const SelectCommand = require('./SelectCommand');

module.exports = class MultiSelectCommand extends SelectCommand {
	static description = 'Test `MultiSelect` component';

	static path = 'multiselect';

	getComponent() {
		return MultiSelect;
	}
};
