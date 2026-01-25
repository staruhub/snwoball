"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronRight, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Indicator {
  id: string;
  name: string;
  formula: string;
  description: string;
  reference: string;
}

interface IndicatorCategory {
  id: string;
  name: string;
  description: string;
  indicators: Indicator[];
}

const indicatorCategories: IndicatorCategory[] = [
  {
    id: "return",
    name: "收益指标",
    description: "衡量基金投资回报的各类指标",
    indicators: [
      {
        id: "period-return",
        name: "区间收益率",
        formula: "R = (P_end - P_start) / P_start * 100%",
        description:
          "区间收益率是指在特定时间段内，投资组合或资产的总回报率。它反映了该时间段内投资的增值或贬值情况。",
        reference: "正值表示盈利，负值表示亏损。一般与同类基金和业绩基准进行比较。",
      },
      {
        id: "annualized-return",
        name: "年化收益率",
        formula: "R_annual = (1 + R_total)^(365/n) - 1",
        description:
          "年化收益率是将不同期限的收益率转换为年度收益率，便于不同投资产品之间的比较。它假设收益在一年内按相同比例增长。",
        reference:
          "偏股型基金年化收益率通常在8%-15%，债券型基金在3%-6%，货币基金在2%-3%。",
      },
      {
        id: "excess-return",
        name: "超额收益",
        formula: "Alpha = R_portfolio - R_benchmark",
        description:
          "超额收益是指投资组合的实际收益超过业绩基准收益的部分。它反映了基金经理的主动管理能力。",
        reference: "正超额收益表示跑赢基准，负超额收益表示跑输基准。持续正超额收益是优秀基金的标志。",
      },
      {
        id: "cumulative-return",
        name: "累计收益率",
        formula: "R_cum = (P_current - P_initial) / P_initial * 100%",
        description:
          "累计收益率是从某一起始点到当前时点的总收益率，不考虑中间的波动情况。",
        reference: "用于评估长期投资效果，需结合投资期限综合判断。",
      },
      {
        id: "rolling-return",
        name: "滚动收益率",
        formula: "R_rolling(t) = R(t-n, t) for each t",
        description:
          "滚动收益率是按固定时间窗口（如滚动1年）计算的收益率序列，可以观察收益的稳定性。",
        reference: "滚动收益率的标准差越小，说明基金收益越稳定。",
      },
    ],
  },
  {
    id: "risk",
    name: "风险指标",
    description: "衡量投资风险程度的各类指标",
    indicators: [
      {
        id: "volatility",
        name: "波动率",
        formula: "Volatility = Std(R) * sqrt(252)",
        description:
          "波动率是收益率的标准差，用于衡量投资回报的不确定性程度。年化波动率通常假设一年有252个交易日。",
        reference:
          "货币基金波动率<1%，债券基金3%-8%，混合基金10%-20%，股票基金20%-30%。",
      },
      {
        id: "max-drawdown",
        name: "最大回撤",
        formula: "MDD = max(P_peak - P_trough) / P_peak",
        description:
          "最大回撤是从历史最高点到最低点的最大跌幅，反映了投资可能面临的最大亏损。",
        reference: "最大回撤越小越好。偏股型基金最大回撤通常在20%-40%，债券基金在5%-15%。",
      },
      {
        id: "var",
        name: "VaR (风险价值)",
        formula: "VaR_alpha = -Quantile(R, alpha)",
        description:
          "VaR是在给定置信水平下，投资组合在持有期内可能遭受的最大损失。例如95% VaR表示有95%的把握损失不会超过该值。",
        reference: "VaR值越小，潜在风险越低。常用95%或99%置信水平。",
      },
      {
        id: "beta",
        name: "Beta (贝塔系数)",
        formula: "Beta = Cov(R_p, R_m) / Var(R_m)",
        description:
          "Beta衡量投资组合相对于市场基准的系统性风险。Beta=1表示与市场同步波动，>1表示波动大于市场，<1表示波动小于市场。",
        reference: "防御型策略Beta<1，进攻型策略Beta>1。Beta不能衡量个股风险。",
      },
      {
        id: "downside-deviation",
        name: "下行风险",
        formula: "DD = sqrt(mean(min(R - MAR, 0)^2))",
        description:
          "下行风险只考虑低于目标收益率（MAR）的收益波动，更符合投资者对风险的直觉认知。",
        reference: "下行风险比标准差更能反映投资者真正关心的亏损风险。",
      },
    ],
  },
  {
    id: "risk-adjusted",
    name: "风险调整收益指标",
    description: "综合考虑收益和风险的指标",
    indicators: [
      {
        id: "sharpe-ratio",
        name: "夏普比率",
        formula: "Sharpe = (R_p - R_f) / Volatility",
        description:
          "夏普比率衡量每承担一单位风险所获得的超额收益。它是评价基金风险调整后收益的最常用指标。",
        reference: "夏普比率>1表示良好，>2表示优秀。比率越高，风险调整后收益越好。",
      },
      {
        id: "sortino-ratio",
        name: "索提诺比率",
        formula: "Sortino = (R_p - R_f) / Downside_Deviation",
        description:
          "索提诺比率与夏普比率类似，但只考虑下行风险，更能反映投资者对亏损风险的关注。",
        reference: "索提诺比率>2表示良好，>3表示优秀。",
      },
      {
        id: "calmar-ratio",
        name: "卡玛比率",
        formula: "Calmar = Annual_Return / Max_Drawdown",
        description:
          "卡玛比率是年化收益率与最大回撤的比值，衡量每承担一单位最大回撤风险所获得的收益。",
        reference: "卡玛比率>1表示良好，>3表示优秀。适合评估中长期投资表现。",
      },
      {
        id: "information-ratio",
        name: "信息比率",
        formula: "IR = (R_p - R_b) / Tracking_Error",
        description:
          "信息比率衡量基金经理创造超额收益的能力与承担主动风险的比值。它反映了主动管理的效率。",
        reference: "信息比率>0.5表示良好，>1表示优秀。是评估主动管理基金的重要指标。",
      },
      {
        id: "treynor-ratio",
        name: "特雷诺比率",
        formula: "Treynor = (R_p - R_f) / Beta",
        description:
          "特雷诺比率衡量每承担一单位系统性风险所获得的超额收益。适用于分散化投资组合。",
        reference: "比率越高表示单位系统风险获得的收益越多。适合比较不同风险水平的基金。",
      },
    ],
  },
  {
    id: "attribution",
    name: "归因指标",
    description: "分析收益来源的指标",
    indicators: [
      {
        id: "brinson-attribution",
        name: "Brinson归因",
        formula:
          "Total = Allocation_Effect + Selection_Effect + Interaction_Effect",
        description:
          "Brinson归因将投资组合超额收益分解为资产配置效应、选股效应和交互效应三部分，帮助理解收益来源。",
        reference:
          "配置效应反映行业配置能力，选股效应反映个股选择能力，交互效应为两者的联合贡献。",
      },
      {
        id: "style-attribution",
        name: "风格归因",
        formula: "R = sum(Factor_Exposure * Factor_Return) + Alpha",
        description:
          "风格归因将投资组合收益分解为各风格因子（如价值、成长、规模等）的贡献和无法解释的Alpha。",
        reference: "帮助了解基金的投资风格和风格漂移情况。",
      },
      {
        id: "factor-exposure",
        name: "因子暴露",
        formula: "Exposure = Cov(R_p, Factor) / Var(Factor)",
        description:
          "因子暴露衡量投资组合对特定风险因子的敏感程度。常见因子包括市场、规模、价值、动量等。",
        reference: "因子暴露帮助理解组合的风险来源和预期收益特征。",
      },
    ],
  },
];

export default function IndicatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["return"]);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Filter indicators based on search
  const filteredCategories = indicatorCategories
    .map((category) => ({
      ...category,
      indicators: category.indicators.filter(
        (indicator) =>
          indicator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          indicator.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.indicators.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">指标说明</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          了解系统中使用的各类金融分析指标
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="搜索指标..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Categories and Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Categories List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);

            return (
              <Card key={category.id} className="overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-[var(--muted)] transition-colors"
                >
                  <div className="text-left">
                    <h3 className="font-medium text-[var(--foreground)]">
                      {category.name}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {category.indicators.length} 个指标
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-[var(--border)]">
                    {category.indicators.map((indicator) => (
                      <button
                        key={indicator.id}
                        onClick={() => setSelectedIndicator(indicator)}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--muted)] transition-colors ${
                          selectedIndicator?.id === indicator.id
                            ? "bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]"
                            : "text-[var(--muted-foreground)]"
                        }`}
                      >
                        {indicator.name}
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Right: Indicator Detail */}
        <div className="lg:col-span-2">
          {selectedIndicator ? (
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    {selectedIndicator.name}
                  </h2>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-2">
                    计算公式
                  </h3>
                  <div className="bg-[var(--muted)] rounded-lg px-4 py-3 font-mono text-sm text-[var(--foreground)]">
                    {selectedIndicator.formula}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-2">
                    指标说明
                  </h3>
                  <p className="text-[var(--foreground)] leading-relaxed">
                    {selectedIndicator.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-2">
                    参考标准
                  </h3>
                  <div className="flex gap-2 items-start">
                    <Info className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-1" />
                    <p className="text-[var(--foreground)] text-sm leading-relaxed">
                      {selectedIndicator.reference}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center py-12">
                <Info className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                  选择一个指标
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  从左侧列表中选择一个指标，查看详细说明
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
