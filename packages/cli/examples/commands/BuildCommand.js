const { Command } = require('../../lib');

module.exports = class BuildCommand extends Command {
  static path = 'build';

  static aliases = ['make'];

  static description = 'Build a project';

  static deprecated = true;

  async run() {
    //
  }
};
