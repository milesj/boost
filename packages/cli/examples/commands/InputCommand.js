const React = require('react');
const { Command, Input } = require('../../lib');

module.exports = class InputCommand extends Command {
  static description = 'Test Input component';

  static path = 'input';

  static category = 'prompt';

  static options = {};

  async run() {
    return React.createElement(Input, {
      focused: true,
      label: 'What is your name?',
      placeholder: '<name>',
      onChange: (value) => {
        this.log('CHANGE', value);
      },
      onSubmit: (value) => {
        this.log('SUBMIT', value);
      },
      validate(value) {
        if (value.length < 3) {
          throw new Error('Must be at least 3 characters');
        }
      },
    });
  }
};
