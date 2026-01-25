'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Check } from 'lucide-react';
import { MODULE_REGISTRY, ModuleCategory, ModuleDefinition } from './module-registry';
import { useReportEditorStore } from '@/stores';

interface ModuleTreeProps {
  searchQuery?: string;
}

export function ModuleTree({ searchQuery = '' }: ModuleTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(MODULE_REGISTRY.map((c) => c.id))
  );
  const { modules, addModule } = useReportEditorStore();
  const addedModuleTypes = new Set(modules.map((m) => m.moduleType));

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleAddModule = (module: ModuleDefinition) => {
    addModule(module.id, module.name);
  };

  // 过滤模块
  const filterModules = (category: ModuleCategory): ModuleDefinition[] => {
    if (!searchQuery.trim()) return category.modules;
    const lowerQuery = searchQuery.toLowerCase();
    return category.modules.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery)
    );
  };

  // 过滤分类（只显示有匹配模块的分类）
  const filteredCategories = MODULE_REGISTRY.map((category) => ({
    ...category,
    modules: filterModules(category),
  })).filter((category) => category.modules.length > 0);

  return (
    <div className="module-tree">
      {filteredCategories.map((category) => (
        <div key={category.id} className="mb-2">
          {/* 分类标题 */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full flex items-center gap-2 px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            {expandedCategories.has(category.id) ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <span>{category.name}</span>
            <span className="ml-auto text-xs text-gray-400">
              {category.modules.length}
            </span>
          </button>

          {/* 模块列表 */}
          {expandedCategories.has(category.id) && (
            <div className="ml-4 space-y-1">
              {category.modules.map((module) => {
                const isAdded = addedModuleTypes.has(module.id);
                return (
                  <div
                    key={module.id}
                    className={`group flex items-center gap-2 px-2 py-2 rounded cursor-pointer transition-colors ${
                      isAdded
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                    onClick={() => !isAdded && handleAddModule(module)}
                    title={module.description}
                  >
                    <span className="text-sm flex-1 truncate">{module.name}</span>
                    {isAdded ? (
                      <Check className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {filteredCategories.length === 0 && searchQuery && (
        <div className="text-center py-8 text-gray-400 text-sm">
          未找到匹配的模块
        </div>
      )}
    </div>
  );
}
