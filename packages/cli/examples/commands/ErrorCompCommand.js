const React = require('react');
const { Box, Text, Static, useApp } = require('ink');
const { Command } = require('../../lib');
const sleep = require('../sleep');

const items = [{ key: 'foo' }, { key: 'bar' }, { key: 'baz' }];

function ThrowError() {
  const { exit } = useApp();

  React.useEffect(() => {
    exit(new Error('Exit was triggered!'));
  }, [exit]);

  return React.createElement(
    Box,
    {},
    // React.createElement(Static, { items }, ({ key }) => React.createElement(Text, { key }, key)),
    React.createElement(Text, {}, 'Content'),
  );
}

module.exports = class ErrorCompCommand extends Command {
  static description = 'Test thrown errors render a failure state (via component)';

  static path = 'error-comp';

  static category = 'test';

  async run() {
    console.log('Will render a component that throws in 1 second...');

    await sleep(1000);

    return React.createElement(ThrowError);
  }
};
