const React = require('react');
const { Command, Select } = require('../../lib');

module.exports = class SelectCommand extends Command {
  static description = 'Test `Select` component';

  static path = 'select';

  static category = 'prompt';

  static options = {
    divider: {
      type: 'boolean',
      description: 'Insert a divider between options',
    },
    flood: {
      type: 'boolean',
      description: 'Generate a giant list of options to test terminal dimensions',
    },
    labels: {
      type: 'boolean',
      description: 'Display options with customized labels',
    },
    limit: {
      type: 'number',
      default: 0,
      description: 'Limit the number of options displayed',
    },
    scroll: {
      choices: ['cycle', 'overflow'],
      type: 'string',
      default: 'overflow',
      description: 'Control how options are scrolled',
    },
  };

  async run() {
    let options = [
      { label: '🍎 Apple', value: 'apple' }, // 0
      { label: '🍌 Banana', value: 'banana' }, // 1
      { label: '🥥 Coconut', value: 'coconut' }, // 2
      { label: '🍇 Grapes', value: 'grapes' }, // 3
      { label: '🥝 Kiwi', value: 'kiwi' }, // 4
      { label: '🍋 Lemon', value: 'lemon' }, // 5
      { label: '🍈 Melon', value: 'melon' }, // 6
      { label: '🍊 Orange', value: 'orange' }, // 7
      { label: '🍑 Peach', value: 'peach' }, // 8
      { label: '🍐 Pear', value: 'pear' }, // 9
      { label: '🍍 Pineapple', value: 'pineapple' }, // 10
      { label: '🍓 Strawberry', value: 'strawberry' }, // 11
      { label: '🍉 Watermelon', value: 'watermelon' }, // 12
    ];

    if (!this.labels) {
      options = options.map((option) => option.value);
    }

    if (this.divider) {
      let i = 0;

      while (i < options.length) {
        i += 4;
        options.splice(i - 1, 0, { divider: true });
      }
    }

    if (this.flood) {
      options = [];

      for (let i = 1; i <= 100; i += 1) {
        options.push(i);
      }
    }

    return React.createElement(this.getComponent(), {
      label: this.flood ? 'Select a value' : 'What is your favorite fruit?',
      limit: this.limit,
      scrollType: this.scroll,
      options,
      validate: (value) => {
        if (value.length === 0) {
          throw new Error('Please select an option');
        }
      },
      // onChange: (value) => {
      //   this.log('CHANGE', value);
      // },
      onSubmit: (value) => {
        this.log('SUBMIT', value);
      },
    });
  }

  getComponent() {
    return Select;
  }
};
