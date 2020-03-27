const React = require('react');
const { Box } = require('ink');
const { Command } = require('../../lib');
const random = require('../random');

function Logger() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    console.log('Initial render');

    function increment() {
      setCount(prev => prev + 1);

      const delay = random(5000, 1000);

      console.log(`Sleeping for ${delay}ms`);

      setTimeout(increment, delay);
    }

    increment();
  }, []);

  return React.createElement(Box, {}, `Rendered ${count} times`);
}

module.exports = class LoggerCommand extends Command {
  static description = 'Test console logs effect on the render loop.';

  static path = 'log';

  run() {
    console.log('Rendering component');

    return React.createElement(Logger);
  }
};
