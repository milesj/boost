/* eslint-disable */

const chalk = require('chalk');

if (!process.env.GH_TOKEN) {
	console.error(chalk.red('Release requires a GH_TOKEN environment variable.'));
	process.exit(1);
}
