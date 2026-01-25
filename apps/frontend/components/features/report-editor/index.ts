// Main component
export { ReportEditor } from './ReportEditor';
export { EditorContent } from './editor-content';
export type { EditorContentProps } from './editor-content';

// Layout components
export { EditorLayout, TopActionBar, CollapsiblePanel } from './layout';

// Navigation components
export {
  ModuleNavigation,
  ModuleTree,
  ModuleSearchBar,
  MODULE_REGISTRY,
  ALL_MODULES,
  getModuleById,
  getCategoryById,
  searchModules,
} from './navigation';
export type { ModuleDefinition, ModuleCategory } from './navigation';

// Canvas components
export { Canvas, ModuleCard, SortableModule, EmptyState } from './canvas';

// Filter components
export {
  FundSelector,
  DateRangePicker,
  BenchmarkSelector,
  FrequencySelector,
  NavTypeSelector,
  GlobalFiltersBar,
} from './filters';

// Config components
export { ConfigPanel, GlobalConfig, ModuleConfig } from './config';

// Dialog components
export { UnsavedChangesDialog } from './UnsavedChangesDialog';
