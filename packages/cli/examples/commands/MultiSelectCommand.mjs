import { MultiSelect } from '../../mjs/react.mjs';
import SelectCommand from './SelectCommand.mjs';

export default class MultiSelectCommand extends SelectCommand {
	static description = 'Test `MultiSelect` component';

	static path = 'multiselect';

	getComponent() {
		return MultiSelect;
	}
}
