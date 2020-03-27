const { Program } = require('../lib');
const ErrorCommand = require('./commands/ErrorCommand');
const LoggerCommand = require('./commands/LoggerCommand');

new Program({
  bin: 'bin',
  name: 'Boost Examples',
  version: '0.0.0',
})
  .register(new ErrorCommand())
  .register(new LoggerCommand())
  .run(process.argv.slice(2));
