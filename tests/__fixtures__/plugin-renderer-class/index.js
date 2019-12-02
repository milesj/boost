const { Plugin } = require('@boost/plugin');

class Renderer extends Plugin {
  blueprint({ string }) {
    return {
      value: string(),
    };
  }

  render() {
    return 'test';
  }
}

module.exports = function rendererPlugin(options) {
  return new Renderer(options);
};
