/* eslint-disable max-classes-per-file */

import { Command, Config } from '../../src';
import BuildCommand from './BuildCommand';
import InstallClassicCommand from './InstallClassicCommand';

class ClientBuildCommand extends BuildCommand {
  static path = 'client:build';
}

class ClientInstallCommand extends InstallClassicCommand {
  static path = 'client:install';
}

@Config('client', 'Client', { usage: ['$ client:install @foo/bar', '$ client:build'] })
class ClientCommand extends Command {
  constructor() {
    super();

    this.register(new ClientBuildCommand());
    this.register(new ClientInstallCommand());
  }

  async run() {
    await Promise.resolve();

    return 'Run sub-command!';
  }
}

export default ClientCommand;
