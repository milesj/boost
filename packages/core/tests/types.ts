/* eslint-disable */

import { bool } from 'optimal';
import { Tool, ToolConfig, ToolPluginRegistry, Plugin, PluginSetting } from '../src';

class Adapter extends Plugin {}
class Renderer extends Plugin {}
class Controller {}

interface ExamplePlugins extends ToolPluginRegistry {
  adapter: Adapter;
  renderer: Renderer;
}

interface ExampleConfig extends ToolConfig {
  adapters: PluginSetting<Adapter>;
  renderers: PluginSetting<Adapter>;
  something: boolean;
}

const tool = new Tool<ExamplePlugins, ExampleConfig>({
  appName: 'example',
  appPath: __dirname,
  configBlueprint: {
    something: bool(),
  },
});

tool.registerPlugin('adapter', Adapter);

tool.registerPlugin('renderer', Renderer, {
  beforeBootstrap(plugin: Renderer) {},
});

// @ts-ignore Unknown plugin type / missing from registry
tool.registerPlugin('controller', Controller);

tool.addPlugin('adapter', new Adapter());
tool.addPlugin('renderer', new Renderer());

const adapter = tool.getPlugin('adapter', 'foo');
const renderer = tool.getPlugin('renderer', 'foo');
