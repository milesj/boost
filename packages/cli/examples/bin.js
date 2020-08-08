const { Program } = require('../lib');
const BuildCommand = require('./commands/BuildCommand');
const ErrorCommand = require('./commands/ErrorCommand');
const LoggerCommand = require('./commands/LoggerCommand');
const ScaffoldCommand = require('./commands/ScaffoldCommand');
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
  })
  .register(new BuildCommand())
  .register(new ErrorCommand())
  .register(new LoggerCommand())
  .register(new ScaffoldCommand())
  .register(new OptionsCommand())
  .register(new ParamsCommand())
  .run(process.argv.slice(2));
