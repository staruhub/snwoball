'use client';

import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Star, StarOff, Plus } from 'lucide-react';
import { useReportEditorStore } from '@/stores';

interface StyleTemplate {
  id: string;
  name: string;
  config: {
    theme: 'light' | 'dark';
    primaryColor: string;
    fontSize: 'small' | 'medium' | 'large';
    fontFamily?: string;
    backgroundColor?: string;
  };
  isDefault?: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'report_style_templates';

// 预设样式模板
const PRESET_TEMPLATES: StyleTemplate[] = [
  {
    id: 'preset-default',
    name: '默认样式',
    config: {
      theme: 'light',
      primaryColor: '#0F5FFE',
      fontSize: 'medium',
    },
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'preset-professional',
    name: '专业蓝',
    config: {
      theme: 'light',
      primaryColor: '#1E40AF',
      fontSize: 'medium',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'preset-modern',
    name: '现代绿',
    config: {
      theme: 'light',
      primaryColor: '#059669',
      fontSize: 'medium',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'preset-elegant',
    name: '优雅紫',
    config: {
      theme: 'light',
      primaryColor: '#7C3AED',
      fontSize: 'medium',
    },
    createdAt: new Date().toISOString(),
  },
];

export function StyleTemplateManager() {
  const { config, updateConfig } = useReportEditorStore();
  const [templates, setTemplates] = useState<StyleTemplate[]>(PRESET_TEMPLATES);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // 从 localStorage 加载用户自定义模板
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const userTemplates = JSON.parse(saved) as StyleTemplate[];
        setTemplates([...PRESET_TEMPLATES, ...userTemplates]);
      }
    } catch (error) {
      console.error('Failed to load style templates:', error);
    }
  }, []);

  // 保存用户模板到 localStorage
  const saveToStorage = (allTemplates: StyleTemplate[]) => {
    const userTemplates = allTemplates.filter(
      (t) => !t.id.startsWith('preset-')
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userTemplates));
  };

  // 保存当前样式为模板
  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;

    const newTemplate: StyleTemplate = {
      id: `user-${Date.now()}`,
      name: newTemplateName.trim(),
      config: {
        theme: config.theme,
        primaryColor: config.primaryColor,
        fontSize: config.fontSize,
      },
      createdAt: new Date().toISOString(),
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    saveToStorage(updatedTemplates);
    setNewTemplateName('');
    setShowSaveModal(false);
  };

  // 加载样式模板
  const handleLoadTemplate = (template: StyleTemplate) => {
    updateConfig({
      theme: template.config.theme,
      primaryColor: template.config.primaryColor,
      fontSize: template.config.fontSize,
    });
    setSelectedTemplate(template.id);
  };

  // 删除用户模板
  const handleDeleteTemplate = (templateId: string) => {
    if (templateId.startsWith('preset-')) return;

    const updatedTemplates = templates.filter((t) => t.id !== templateId);
    setTemplates(updatedTemplates);
    saveToStorage(updatedTemplates);

    if (selectedTemplate === templateId) {
      setSelectedTemplate(null);
    }
  };

  // 设置默认模板
  const handleSetDefault = (templateId: string) => {
    const updatedTemplates = templates.map((t) => ({
      ...t,
      isDefault: t.id === templateId,
    }));
    setTemplates(updatedTemplates);
    saveToStorage(updatedTemplates);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-800">样式模板</h4>
        <button
          onClick={() => setShowSaveModal(true)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          <Plus className="w-3 h-3" />
          保存当前样式
        </button>
      </div>

      {/* 模板列表 */}
      <div className="space-y-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => handleLoadTemplate(template)}
          >
            {/* 颜色预览 */}
            <div
              className="w-6 h-6 rounded-md flex-shrink-0"
              style={{ backgroundColor: template.config.primaryColor }}
            />

            {/* 模板名称 */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {template.name}
              </div>
              <div className="text-xs text-gray-500">
                {template.config.theme === 'dark' ? '深色' : '浅色'} · {
                  template.config.fontSize === 'small' ? '小号'
                    : template.config.fontSize === 'large' ? '大号'
                    : '中号'
                }字体
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-1">
              {template.isDefault && (
                <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                  默认
                </span>
              )}

              {!template.id.startsWith('preset-') && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(template.id);
                    }}
                    className="p-1 text-gray-400 hover:text-amber-500 transition-colors"
                    title={template.isDefault ? '取消默认' : '设为默认'}
                  >
                    {template.isDefault ? (
                      <Star className="w-4 h-4 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(template.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 保存模板弹窗 */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSaveModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              保存样式模板
            </h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                模板名称
              </label>
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="输入模板名称"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* 当前样式预览 */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-2">当前样式</div>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: config.primaryColor }}
                />
                <span className="text-sm text-gray-700">
                  {config.theme === 'dark' ? '深色' : '浅色'} · {
                    config.fontSize === 'small' ? '小号'
                      : config.fontSize === 'large' ? '大号'
                      : '中号'
                  }字体
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!newTemplateName.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
