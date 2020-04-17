const React = require('react');
const { Box } = require('ink');
const { Command, ProgramContext } = require('../../lib');
const random = require('../random');

let timer;

function Logger() {
  const [count, setCount] = React.useState(0);
  const ctx = React.useContext(ProgramContext);

  React.useEffect(() => {
    console.log('Initial render');

    function increment() {
      if (timer) {
        return;
      }

      setCount(prev => prev + 1);

      const delay = random(5000, 1000);

      console.log(`Sleeping for ${delay}ms`);
      ctx.log.error('Logging from context');

      timer = setTimeout(() => {
        timer = null;
        increment();
      }, delay);
    }

    increment();
  }, [ctx]);

  return React.createElement(Box, {}, `Rendered ${count} times`);
}

module.exports = class LoggerCommand extends Command {
  static description = 'Test console logs effect on the render loop.';

  static path = 'log';

  run() {
    this.log.info('Rendering component');

    return React.createElement(Logger);
  }
};