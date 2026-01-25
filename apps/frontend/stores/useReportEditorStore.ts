'use client';

import { create } from 'zustand';

// 模块实例类型
export interface ModuleInstance {
  id: string;
  moduleType: string;
  title: string;
  order: number;
  height: number; // 模块高度
  isLocked: boolean; // 参数是否锁定
  config: Record<string, unknown>; // 模块独立配置
}

// 报告配置类型
export interface ReportConfig {
  name: string;
  theme: 'light' | 'dark';
  primaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  showPageNumbers: boolean;
  showTableOfContents: boolean;
}

// 编辑器状态类型
interface ReportEditorState {
  // 报告基础信息
  reportId: string | null;
  reportName: string;

  // 模块列表
  modules: ModuleInstance[];
  selectedModuleId: string | null;

  // 报告配置
  config: ReportConfig;

  // 保存状态
  isDirty: boolean;
  lastSavedAt: Date | null;
  isSaving: boolean;

  // 面板显示状态
  isLeftPanelCollapsed: boolean;
  isRightPanelCollapsed: boolean;

  // Actions
  setReportId: (id: string | null) => void;
  setReportName: (name: string) => void;

  // 模块操作
  addModule: (moduleType: string, title: string) => void;
  removeModule: (moduleId: string) => void;
  cloneModule: (moduleId: string) => void;
  selectModule: (moduleId: string | null) => void;
  reorderModules: (activeId: string, overId: string) => void;
  updateModuleHeight: (moduleId: string, height: number) => void;
  updateModuleTitle: (moduleId: string, title: string) => void;
  updateModuleConfig: (moduleId: string, config: Partial<Record<string, unknown>>) => void;
  toggleModuleLock: (moduleId: string) => void;
  batchUpdateModules: (moduleIds: string[], updates: Partial<Pick<ModuleInstance, 'height' | 'isLocked'>>) => void;

  // 配置操作
  updateConfig: (config: Partial<ReportConfig>) => void;

  // 保存状态
  markDirty: () => void;
  markSaved: () => void;
  setSaving: (saving: boolean) => void;

  // 面板操作
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;

  // 重置状态
  reset: () => void;
}

// 生成唯一 ID
const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `module_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

// 默认配置
const defaultConfig: ReportConfig = {
  name: '未命名报告',
  theme: 'light',
  primaryColor: '#0F5FFE',
  fontFamily: 'Roboto',
  fontSize: 'medium',
  showPageNumbers: true,
  showTableOfContents: true,
};

// 创建 Store
export const useReportEditorStore = create<ReportEditorState>((set, get) => ({
  // 初始状态
  reportId: null,
  reportName: '未命名报告',
  modules: [],
  selectedModuleId: null,
  config: defaultConfig,
  isDirty: false,
  lastSavedAt: null,
  isSaving: false,
  isLeftPanelCollapsed: false,
  isRightPanelCollapsed: false,

  // 基础信息
  setReportId: (id) => set({ reportId: id }),
  setReportName: (name) => set({ reportName: name, isDirty: true }),

  // 模块操作
  addModule: (moduleType, title) => {
    const modules = get().modules;
    const newModule: ModuleInstance = {
      id: generateId(),
      moduleType,
      title,
      order: modules.length,
      height: 300, // 默认高度
      isLocked: false,
      config: {},
    };
    set({
      modules: [...modules, newModule],
      isDirty: true,
      selectedModuleId: newModule.id,
    });
  },

  removeModule: (moduleId) => {
    const { modules, selectedModuleId } = get();
    // 使用 map 创建新对象，遵循不可变性原则
    const newModules = modules
      .filter((m) => m.id !== moduleId)
      .map((m, i) => ({ ...m, order: i }));
    set({
      modules: newModules,
      isDirty: true,
      selectedModuleId: selectedModuleId === moduleId ? null : selectedModuleId,
    });
  },

  cloneModule: (moduleId) => {
    const { modules } = get();
    const sourceModule = modules.find((m) => m.id === moduleId);
    if (!sourceModule) return;

    const clonedModule: ModuleInstance = {
      ...sourceModule,
      id: generateId(),
      title: `${sourceModule.title} (副本)`,
      order: sourceModule.order + 1,
      config: { ...sourceModule.config },
    };

    // 插入到源模块后面
    const tempModules = [...modules];
    const sourceIndex = modules.findIndex((m) => m.id === moduleId);
    tempModules.splice(sourceIndex + 1, 0, clonedModule);
    // 使用 map 创建新对象，遵循不可变性原则
    const newModules = tempModules.map((m, i) => ({ ...m, order: i }));

    set({ modules: newModules, isDirty: true, selectedModuleId: clonedModule.id });
  },

  selectModule: (moduleId) => set({ selectedModuleId: moduleId }),

  reorderModules: (activeId, overId) => {
    const { modules } = get();
    const activeIndex = modules.findIndex((m) => m.id === activeId);
    const overIndex = modules.findIndex((m) => m.id === overId);

    if (activeIndex === -1 || overIndex === -1) return;

    const tempModules = [...modules];
    const [movedModule] = tempModules.splice(activeIndex, 1);
    tempModules.splice(overIndex, 0, movedModule);
    // 使用 map 创建新对象，遵循不可变性原则
    const newModules = tempModules.map((m, i) => ({ ...m, order: i }));

    set({ modules: newModules, isDirty: true });
  },

  updateModuleHeight: (moduleId, height) => {
    const { modules } = get();
    set({
      modules: modules.map((m) => (m.id === moduleId ? { ...m, height } : m)),
      isDirty: true,
    });
  },

  updateModuleTitle: (moduleId, title) => {
    const { modules } = get();
    set({
      modules: modules.map((m) => (m.id === moduleId ? { ...m, title } : m)),
      isDirty: true,
    });
  },

  updateModuleConfig: (moduleId, config) => {
    const { modules } = get();
    set({
      modules: modules.map((m) =>
        m.id === moduleId ? { ...m, config: { ...m.config, ...config } } : m
      ),
      isDirty: true,
    });
  },

  toggleModuleLock: (moduleId) => {
    const { modules } = get();
    set({
      modules: modules.map((m) =>
        m.id === moduleId ? { ...m, isLocked: !m.isLocked } : m
      ),
      isDirty: true,
    });
  },

  batchUpdateModules: (moduleIds, updates) => {
    const { modules } = get();
    set({
      modules: modules.map((m) =>
        moduleIds.includes(m.id) ? { ...m, ...updates } : m
      ),
      isDirty: true,
    });
  },

  // 配置操作
  updateConfig: (config) => {
    set((state) => ({
      config: { ...state.config, ...config },
      isDirty: true,
    }));
  },

  // 保存状态
  markDirty: () => set({ isDirty: true }),
  markSaved: () => set({ isDirty: false, lastSavedAt: new Date() }),
  setSaving: (saving) => set({ isSaving: saving }),

  // 面板操作
  toggleLeftPanel: () => set((state) => ({ isLeftPanelCollapsed: !state.isLeftPanelCollapsed })),
  toggleRightPanel: () => set((state) => ({ isRightPanelCollapsed: !state.isRightPanelCollapsed })),

  // 重置
  reset: () => set({
    reportId: null,
    reportName: '未命名报告',
    modules: [],
    selectedModuleId: null,
    config: defaultConfig,
    isDirty: false,
    lastSavedAt: null,
    isSaving: false,
    isLeftPanelCollapsed: false,
    isRightPanelCollapsed: false,
  }),
}));
