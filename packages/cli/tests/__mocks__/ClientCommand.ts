import { Command, Config } from '../../src';
import BuildCommand from './BuildCommand';
import InstallClassicCommand from './InstallClassicCommand';

@Config('client', 'Client', { usage: ['$ client:install @foo/bar', '$ client:build'] })
class ClientCommand extends Command {
  bootstrap() {
    this.registerCommand(new BuildCommand()).registerCommand(new InstallClassicCommand());
  }

  async run() {
    await Promise.resolve();

    return 'Run sub-command!';
  }
}

export default ClientCommand;
