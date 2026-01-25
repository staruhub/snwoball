'use client';

import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Check } from 'lucide-react';
import { useReportEditorStore, type ReportConfig } from '@/stores';
import { Modal } from '@/components/ui/modal';

// 样式模板类型
interface StyleTemplate {
  id: string;
  name: string;
  theme: ReportConfig['theme'];
  primaryColor: string;
  fontSize: ReportConfig['fontSize'];
  createdAt: string;
}

// 本地存储键名
const STYLE_TEMPLATES_KEY = 'snowball_style_templates';

// 获取存储的样式模板
function getStoredTemplates(): StyleTemplate[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STYLE_TEMPLATES_KEY);
  return stored ? JSON.parse(stored) : [];
}

// 保存样式模板
function saveTemplates(templates: StyleTemplate[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STYLE_TEMPLATES_KEY, JSON.stringify(templates));
}

export function GlobalConfig() {
  const { config, updateConfig } = useReportEditorStore();
  const [styleTemplates, setStyleTemplates] = useState<StyleTemplate[]>([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  // 加载存储的样式模板
  useEffect(() => {
    setStyleTemplates(getStoredTemplates());
  }, []);

  // 保存样式模板
  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;

    const newTemplate: StyleTemplate = {
      id: `style_${Date.now()}`,
      name: templateName.trim(),
      theme: config.theme,
      primaryColor: config.primaryColor,
      fontSize: config.fontSize,
      createdAt: new Date().toISOString(),
    };

    const updatedTemplates = [...styleTemplates, newTemplate];
    setStyleTemplates(updatedTemplates);
    saveTemplates(updatedTemplates);

    setTemplateName('');
    setSaveModalOpen(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  // 加载样式模板
  const handleLoadTemplate = (template: StyleTemplate) => {
    updateConfig({
      theme: template.theme,
      primaryColor: template.primaryColor,
      fontSize: template.fontSize,
    });
    setLoadModalOpen(false);
  };

  // 删除样式模板
  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = styleTemplates.filter(t => t.id !== templateId);
    setStyleTemplates(updatedTemplates);
    saveTemplates(updatedTemplates);
  };

  return (
    <div className="p-4 space-y-6">
      {/* 基础设置 */}
      <div>
        <h4 className="text-sm font-medium text-gray-800 mb-3">基础设置</h4>
        <div className="space-y-4">
          {/* 报告名称 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">报告名称</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 显示页码 */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">显示页码</label>
            <button
              onClick={() =>
                updateConfig({ showPageNumbers: !config.showPageNumbers })
              }
              className={`relative w-10 h-6 rounded-full transition-colors ${
                config.showPageNumbers ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  config.showPageNumbers ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* 显示目录 */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">显示目录</label>
            <button
              onClick={() =>
                updateConfig({
                  showTableOfContents: !config.showTableOfContents,
                })
              }
              className={`relative w-10 h-6 rounded-full transition-colors ${
                config.showTableOfContents ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  config.showTableOfContents ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 样式设置 */}
      <div>
        <h4 className="text-sm font-medium text-gray-800 mb-3">样式设置</h4>
        <div className="space-y-4">
          {/* 主题 */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">主题</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateConfig({ theme: 'light' })}
                className={`flex-1 py-2 text-sm rounded-lg border ${
                  config.theme === 'light'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                浅色
              </button>
              <button
                onClick={() => updateConfig({ theme: 'dark' })}
                className={`flex-1 py-2 text-sm rounded-lg border ${
                  config.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                深色
              </button>
            </div>
          </div>

          {/* 主题色 */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">主题色</label>
            <div className="flex gap-2">
              {[
                '#0F5FFE', // 蓝色
                '#10B981', // 绿色
                '#F59E0B', // 橙色
                '#EF4444', // 红色
                '#8B5CF6', // 紫色
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => updateConfig({ primaryColor: color })}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    config.primaryColor === color
                      ? 'border-gray-800'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* 字体大小 */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">字体大小</label>
            <div className="flex gap-2">
              {[
                { value: 'small', label: '小' },
                { value: 'medium', label: '中' },
                { value: 'large', label: '大' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateConfig({
                      fontSize: option.value as 'small' | 'medium' | 'large',
                    })
                  }
                  className={`flex-1 py-2 text-sm rounded-lg border ${
                    config.fontSize === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 样式模板 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-800">样式模板</h4>
          {savedMessage && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <Check className="w-3 h-3" />
              已保存
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSaveModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <Save className="w-4 h-4" />
            保存当前样式
          </button>
          <button
            onClick={() => setLoadModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            加载样式模板
          </button>
        </div>
      </div>

      {/* 保存样式模板弹窗 */}
      <Modal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="保存样式模板"
        width="400px"
        footer={
          <>
            <button
              onClick={() => setSaveModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded"
            >
              取消
            </button>
            <button
              onClick={handleSaveTemplate}
              disabled={!templateName.trim()}
              className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">模板名称</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="输入模板名称"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">将保存以下样式设置：</p>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-500">主题:</span>
                <span className="text-gray-700">{config.theme === 'light' ? '浅色' : '深色'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">主题色:</span>
                <span
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: config.primaryColor }}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">字体:</span>
                <span className="text-gray-700">
                  {config.fontSize === 'small' ? '小' : config.fontSize === 'medium' ? '中' : '大'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* 加载样式模板弹窗 */}
      <Modal
        open={loadModalOpen}
        onClose={() => setLoadModalOpen(false)}
        title="加载样式模板"
        width="480px"
      >
        {styleTemplates.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无保存的样式模板</p>
            <p className="text-xs mt-1">点击「保存当前样式」创建第一个模板</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {styleTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group"
                onClick={() => handleLoadTemplate(template)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span
                      className="w-5 h-5 rounded border border-gray-300"
                      style={{ backgroundColor: template.primaryColor }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{template.name}</div>
                    <div className="text-xs text-gray-500">
                      {template.theme === 'light' ? '浅色' : '深色'} ·
                      {template.fontSize === 'small' ? '小号字体' : template.fontSize === 'medium' ? '中号字体' : '大号字体'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTemplate(template.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="删除模板"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
