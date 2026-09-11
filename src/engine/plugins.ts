/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IPlugin, IDIContainer } from "./interfaces.ts";

export class PluginLoader {
  private plugins: Map<string, IPlugin> = new Map();

  constructor(private container: IDIContainer) {}

  async registerPlugin(plugin: IPlugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`[PluginLoader] Plugin already registered: ${plugin.id}`);
    }
    
    const logger = this.container.resolve<any>("logger");
    logger.info("PluginLoader", `Initializing Plugin: [${plugin.name}] (v${plugin.version})`);
    
    await plugin.initialize(this.container);
    this.plugins.set(plugin.id, plugin);
    
    logger.info("PluginLoader", `Plugin fully initialized and locked: ${plugin.id}`);
  }

  listPlugins(): IPlugin[] {
    return Array.from(this.plugins.values());
  }
}
