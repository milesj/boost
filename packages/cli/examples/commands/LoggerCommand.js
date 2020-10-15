const React = require('react');
const { Box, Text } = require('ink');
const { Command, ProgramContext } = require('../../lib');
const random = require('../random');

let timer;

function Logger() {
  const [count, setCount] = React.useState(0);
  const ctx = React.useContext(ProgramContext);

  React.useEffect(() => {
    console.warn('Initial render');

    function increment() {
      if (timer) {
        return;
      }

      setCount((prev) => prev + 1);

      const delay = random(3000, 250);

      console.info(`Sleeping for ${delay}ms`);
      ctx.log.error('Logging from context');

      timer = setTimeout(() => {
        timer = null;
        increment();
      }, delay);
    }

    increment();
  }, [ctx]);

  return React.createElement(Box, {}, React.createElement(Text, {}, `Rendered ${count} times`));
}

module.exports = class LoggerCommand extends Command {
  static description = 'Test console logs effect on the render loop';

  static path = 'log';

  static category = 'test';

  run() {
    this.log.info('Rendering component');

    return React.createElement(Logger);
  }
};
