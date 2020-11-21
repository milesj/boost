const React = require('react');
const { Command, Select } = require('../../lib');

module.exports = class SelectCommand extends Command {
  static description = 'Test `Select` component';

  static path = 'select';

  static category = 'prompt';

  static options = {
    labels: {
      type: 'boolean',
      description: 'Display options with customized labels',
    },
    limit: {
      type: 'number',
      default: 0,
      description: 'Limit the number of results displayed',
    },
  };

  async run() {
    let options = [
      { label: '🍎  Apple', value: 'apple' }, // 0
      { label: '🍌  Banana', value: 'banana' }, // 1
      { label: '🥥  Coconut', value: 'coconut' }, // 2
      { label: '🍇  Grapes', value: 'grapes' }, // 3
      { label: '🥝  Kiwi', value: 'kiwi' }, // 4
      { label: '🍋  Lemon', value: 'lemon' }, // 5
      { label: '🍈  Melon', value: 'melon' }, // 6
      { label: '🍊  Orange', value: 'orange' }, // 7
      { label: '🍑  Peach', value: 'peach' }, // 8
      { label: '🍐  Pear', value: 'pear' }, // 9
      { label: '🍍  Pineapple', value: 'pineapple' }, // 10
      { label: '🍓  Strawberry', value: 'strawberry' }, // 11
      { label: '🍉  Watermelon', value: 'watermelon' }, // 12
    ];

    if (!this.labels) {
      options = options.map((option) => option.value);
    }

    return React.createElement(Select, {
      label: 'What is your favorite fruit?',
      limit: this.limit,
      options,
      onSubmit: (value) => {
        this.log('SUBMIT', value);
      },
    });
  }
};
