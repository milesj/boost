const React = require('react');
const { Command, Confirm } = require('../../lib');

module.exports = class ConfirmCommand extends Command {
  static description = 'Test `Confirm` component';

  static path = 'confirm';

  static category = 'prompt';

  static options = {};

  async run() {
    return React.createElement(Confirm, {
      label: 'Do you want to continue?',
      onSubmit: (value) => {
        this.log('SUBMIT', value);
      },
    });
  }
};
