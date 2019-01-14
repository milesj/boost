/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Tool, ToolConfig, ToolPluginRegistry, Plugin, PluginSetting } from '@boost/core';

export interface TestToolPluginRegistry extends ToolPluginRegistry {
  plugin: Plugin;
}

export interface TestToolConfig extends ToolConfig {
  plugins: PluginSetting<Plugin>;
}

export type TestTool = Tool<TestToolPluginRegistry, TestToolConfig>;

// When using workspaces, TypeScript has issues differentiating between
// source files (src/) and built files (lib/), so we can't use explicit types.
// So instead, let's rely on type widening to handle mocks (for now).
export interface ToolLike {
  config: object;
  options: object;
  package: object;
}
