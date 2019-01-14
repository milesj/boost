/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Tool, ToolConfig, ToolPluginRegistry, Plugin, PluginSetting } from '@boost/core';

export interface TestPluginRegistry extends ToolPluginRegistry {
  plugin: Plugin;
}

export interface TestToolConfig extends ToolConfig {
  plugins: PluginSetting<Plugin>;
}

export type TestTool = Tool<TestPluginRegistry, TestToolConfig>;
