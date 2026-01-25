/**
 * 模块注册表
 * 管理所有可用模块的注册和查询
 */

import {
  ModuleDefinition,
  ModuleComponent,
  ModuleRegistryEntry,
  ModuleCategory,
  ConfigSchema,
  MODULE_CATEGORIES,
} from "./types";

class ModuleRegistry {
  private modules: Map<string, ModuleRegistryEntry> = new Map();

  /**
   * 注册模块
   */
  register(
    definition: ModuleDefinition,
    component: ModuleComponent,
    configSchema?: ConfigSchema
  ): void {
    if (this.modules.has(definition.id)) {
      console.warn(`Module ${definition.id} already registered, overwriting`);
    }
    this.modules.set(definition.id, { definition, component, configSchema });
  }

  /**
   * 获取模块
   */
  get(moduleId: string): ModuleRegistryEntry | undefined {
    return this.modules.get(moduleId);
  }

  /**
   * 获取模块组件
   */
  getComponent(moduleId: string): ModuleComponent | undefined {
    return this.modules.get(moduleId)?.component;
  }

  /**
   * 获取模块定义
   */
  getDefinition(moduleId: string): ModuleDefinition | undefined {
    return this.modules.get(moduleId)?.definition;
  }

  /**
   * 获取模块配置 Schema
   */
  getConfigSchema(moduleId: string): ConfigSchema | undefined {
    return this.modules.get(moduleId)?.configSchema;
  }

  /**
   * 获取所有模块定义
   */
  getAllDefinitions(): ModuleDefinition[] {
    return Array.from(this.modules.values()).map((entry) => entry.definition);
  }

  /**
   * 按分类获取模块
   */
  getByCategory(category: ModuleCategory): ModuleDefinition[] {
    return this.getAllDefinitions().filter((def) => def.category === category);
  }

  /**
   * 获取分组后的模块
   */
  getGroupedModules(): Map<ModuleCategory, ModuleDefinition[]> {
    const grouped = new Map<ModuleCategory, ModuleDefinition[]>();

    // 按顺序初始化分类
    MODULE_CATEGORIES.forEach((cat) => {
      grouped.set(cat.id, []);
    });

    // 分组
    this.getAllDefinitions().forEach((def) => {
      const list = grouped.get(def.category);
      if (list) {
        list.push(def);
      }
    });

    // 移除空分类
    grouped.forEach((modules, category) => {
      if (modules.length === 0) {
        grouped.delete(category);
      }
    });

    return grouped;
  }

  /**
   * 检查模块是否存在
   */
  has(moduleId: string): boolean {
    return this.modules.has(moduleId);
  }

  /**
   * 获取模块数量
   */
  get size(): number {
    return this.modules.size;
  }
}

// 单例导出
export const moduleRegistry = new ModuleRegistry();

// 便捷注册函数
export function registerModule(
  definition: ModuleDefinition,
  component: ModuleComponent,
  configSchema?: ConfigSchema
): void {
  moduleRegistry.register(definition, component, configSchema);
}
