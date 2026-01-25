// 模块注册表 - 定义所有可用的分析模块

export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide-react 图标名称
  category: string;
}

export interface ModuleCategory {
  id: string;
  name: string;
  icon: string;
  modules: ModuleDefinition[];
}

// 所有可用模块的分类和定义
export const MODULE_REGISTRY: ModuleCategory[] = [
  {
    id: 'product-info',
    name: '产品信息',
    icon: 'Info',
    modules: [
      { id: 'product-header', name: '产品表头', description: '显示基金名称、代码等基本信息', icon: 'FileText', category: 'product-info' },
      { id: 'basic-info', name: '基本信息', description: '基金类型、成立日期、托管人等', icon: 'List', category: 'product-info' },
      { id: 'fund-manager', name: '基金经理', description: '基金经理信息及任职情况', icon: 'User', category: 'product-info' },
      { id: 'product-elements', name: '产品要素', description: '投资目标、投资范围、业绩比较基准', icon: 'Target', category: 'product-info' },
      { id: 'fee-info', name: '费率信息', description: '管理费、托管费、申购赎回费率', icon: 'DollarSign', category: 'product-info' },
      { id: 'historical-scale', name: '历史规模', description: '基金规模变化历史', icon: 'BarChart2', category: 'product-info' },
    ],
  },
  {
    id: 'return-analysis',
    name: '收益统计',
    icon: 'TrendingUp',
    modules: [
      { id: 'nav-trend', name: '净值走势图', description: '基金净值走势与基准对比', icon: 'LineChart', category: 'return-analysis' },
      { id: 'period-return', name: '区间收益', description: '不同时间区间的收益率统计', icon: 'Calendar', category: 'return-analysis' },
      { id: 'yearly-return', name: '年度收益', description: '历年收益率统计', icon: 'CalendarDays', category: 'return-analysis' },
      { id: 'monthly-return', name: '月度收益', description: '月度收益率热力图', icon: 'CalendarRange', category: 'return-analysis' },
      { id: 'rolling-return', name: '滚动收益', description: '滚动收益率分析', icon: 'RefreshCw', category: 'return-analysis' },
      { id: 'cumulative-return', name: '累计收益走势', description: '累计收益率曲线', icon: 'ArrowUpRight', category: 'return-analysis' },
      { id: 'excess-return', name: '超额收益走势', description: '相对基准的超额收益', icon: 'ArrowUp', category: 'return-analysis' },
    ],
  },
  {
    id: 'risk-analysis',
    name: '风险统计',
    icon: 'Shield',
    modules: [
      { id: 'rolling-volatility', name: '滚动波动率', description: '滚动波动率走势', icon: 'Activity', category: 'risk-analysis' },
      { id: 'max-drawdown', name: '最大回撤', description: '历史最大回撤分析', icon: 'TrendingDown', category: 'risk-analysis' },
      { id: 'dynamic-drawdown', name: '动态回撤', description: '动态回撤走势图', icon: 'ArrowDown', category: 'risk-analysis' },
      { id: 'risk-adjusted-return', name: '风险调整收益', description: '夏普、索提诺、卡玛比率', icon: 'Scale', category: 'risk-analysis' },
    ],
  },
  {
    id: 'performance',
    name: '业绩表现',
    icon: 'Award',
    modules: [
      { id: 'performance-overview', name: '业绩概览表', description: '综合业绩指标汇总', icon: 'Table', category: 'performance' },
      { id: 'peer-ranking', name: '同类排名', description: '在同类基金中的排名', icon: 'Medal', category: 'performance' },
    ],
  },
  {
    id: 'portfolio-analysis',
    name: '组合分析',
    icon: 'PieChart',
    modules: [
      { id: 'asset-allocation', name: '资产配置', description: '股票、债券、现金配置比例', icon: 'PieChart', category: 'portfolio-analysis' },
      { id: 'industry-allocation', name: '行业配置', description: '行业配置分布', icon: 'Building', category: 'portfolio-analysis' },
      { id: 'top-holdings', name: '重仓股票', description: '前十大重仓股票明细', icon: 'Layers', category: 'portfolio-analysis' },
    ],
  },
];

// 扁平化所有模块
export const ALL_MODULES: ModuleDefinition[] = MODULE_REGISTRY.flatMap(
  (category) => category.modules
);

// 根据 ID 获取模块定义
export function getModuleById(moduleId: string): ModuleDefinition | undefined {
  return ALL_MODULES.find((m) => m.id === moduleId);
}

// 根据 ID 获取分类
export function getCategoryById(categoryId: string): ModuleCategory | undefined {
  return MODULE_REGISTRY.find((c) => c.id === categoryId);
}

// 搜索模块（按名称和描述）
export function searchModules(query: string): ModuleDefinition[] {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return ALL_MODULES.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.description.toLowerCase().includes(lowerQuery)
  );
}
