const { Program } = require('../lib');
const BuildCommand = require('./commands/BuildCommand');
const ConfirmCommand = require('./commands/ConfirmCommand');
const ErrorCommand = require('./commands/ErrorCommand');
const ErrorCompCommand = require('./commands/ErrorCompCommand');
const ExitCommand = require('./commands/ExitCommand');
const ExitCompCommand = require('./commands/ExitCompCommand');
const InputCommand = require('./commands/InputCommand');
const LoggerCommand = require('./commands/LoggerCommand');
const ScaffoldCommand = require('./commands/ScaffoldCommand');
const SelectCommand = require('./commands/SelectCommand');
const OptionsCommand = require('./commands/OptionsCommand');
const ParamsCommand = require('./commands/ParamsCommand');

const banner = ` __                      __
|  |--.-----.-----.-----|  |_
|  _  |  _  |  _  |__ --|   _|
|_____|_____|_____|_____|____|`;

new Program({
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
  .register(new SelectCommand())
  .runAndExit(process.argv.slice(2));
