const { Command } = require('../../lib');
const sleep = require('../sleep');

module.exports = class ErrorCommand extends Command {
  static description = 'Test thrown errors render a failure state.';

  static path = 'error';

  async run() {
    console.log('Will throw an error in 3 seconds...');

    await sleep(3000);

    throw new Error('Custom thrown error!');
  }
};
