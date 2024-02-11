// if (process.env.TIMING) {
// 	require('time-require');
// }

import { Program } from '../mjs/index.mjs';
import BuildCommand from './commands/BuildCommand.mjs';
import ConfirmCommand from './commands/ConfirmCommand.mjs';
import ErrorCommand from './commands/ErrorCommand.mjs';
import ErrorCompCommand from './commands/ErrorCompCommand.mjs';
import ExitCommand from './commands/ExitCommand.mjs';
import ExitCompCommand from './commands/ExitCompCommand.mjs';
import InputCommand from './commands/InputCommand.mjs';
import LoggerCommand from './commands/LoggerCommand.mjs';
import MultiSelectCommand from './commands/MultiSelectCommand.mjs';
import OptionsCommand from './commands/OptionsCommand.mjs';
import ParamsCommand from './commands/ParamsCommand.mjs';
import ScaffoldCommand from './commands/ScaffoldCommand.mjs';
import SelectCommand from './commands/SelectCommand.mjs';

const banner = ` __                      __
|  |--.-----.-----.-----|  |_
|  _  |  _  |  _  |__ --|   _|
|_____|_____|_____|_____|____|`;

void new Program({
	banner,
	bin: 'boost',
	footer: 'Documentation: https://boostlib.dev',
	name: 'Boost Examples',
	version: '1.2.3',
})
	.categories({
		feature: 'Features',
		test: 'Test cases',
		prompt: 'Prompts',
	})
	.register(new BuildCommand())
	.register(new ErrorCommand())
	.register(new ErrorCompCommand())
	.register(new ExitCommand())
	.register(new ExitCompCommand())
	.register(new LoggerCommand())
	.register(new ScaffoldCommand())
	.register(new OptionsCommand())
	.register(new ParamsCommand())
	// Prompts
	.register(new ConfirmCommand())
	.register(new InputCommand())
	.register(new MultiSelectCommand())
	.register(new SelectCommand())
	.runAndExit(process.argv.slice(2));
