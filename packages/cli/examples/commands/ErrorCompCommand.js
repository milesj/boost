const React = require('react');
const { Text } = require('ink');
const { Command } = require('../../lib');
const sleep = require('../sleep');

function ThrowError() {
  React.useEffect(() => {
    throw new Error('Exit was triggered!');
  }, []);

  return React.createElement(Text, {}, 'Content');
}

module.exports = class ErrorCompCommand extends Command {
  static description = 'Test thrown errors render a failure state (via component)';

  static path = 'error-comp';

  static category = 'test';

  async run() {
    console.log('Will render a component that throws an error in 1 second...');

    await sleep(1000);

    return React.createElement(ThrowError);
  }
};
