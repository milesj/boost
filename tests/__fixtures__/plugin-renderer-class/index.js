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

// Async
module.exports = async function rendererPlugin(options) {
  await Promise.resolve();

  return new Renderer(options);
};
