"use client";

import { useState } from "react";
import {
  FileText,
  PlusCircle,
  Download,
  Layout,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface GuideStep {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: GuideStep[];
}

const guideSections: GuideSection[] = [
  {
    id: "create-report",
    title: "创建第一份报告",
    icon: <FileText className="w-6 h-6" />,
    description: "了解如何创建和编辑基金分析报告",
    steps: [
      {
        id: "step-1",
        title: "进入报告编辑器",
        description: "从工作台开始创建报告",
        steps: [
          "登录系统后进入工作台首页",
          "点击快捷入口区的「新建报告」按钮",
          "或从顶部导航栏选择「新建 > 空白报告」",
        ],
      },
      {
        id: "step-2",
        title: "选择基金产品",
        description: "设置报告的目标基金",
        steps: [
          "在编辑器顶部的全局筛选条件区域找到基金选择器",
          "输入基金名称或代码进行搜索",
          "从搜索结果中选择目标基金",
          "也可以从「最近使用」或「我的关注」快速选择",
        ],
      },
      {
        id: "step-3",
        title: "设置分析参数",
        description: "配置时间范围和业绩基准",
        steps: [
          "选择日期范围（成立以来、近1年、近3年等）",
          "选择业绩基准（沪深300、中证500等）",
          "选择数据频率（日、周、月）",
          "选择净值类型（复权/非复权）",
        ],
      },
      {
        id: "step-4",
        title: "保存报告",
        description: "保存您的工作成果",
        steps: [
          "点击编辑器右上角的「保存」按钮",
          "输入报告名称和描述",
          "系统支持自动保存功能，每60秒自动保存一次",
        ],
      },
    ],
  },
  {
    id: "add-modules",
    title: "添加分析模块",
    icon: <PlusCircle className="w-6 h-6" />,
    description: "学习如何在报告中添加各类分析模块",
    steps: [
      {
        id: "step-1",
        title: "浏览可用模块",
        description: "了解系统提供的分析模块",
        steps: [
          "在编辑器左侧查看模块导航面板",
          "模块按分类组织：产品信息、收益统计、风险统计等",
          "点击分类名称展开查看该分类下的所有模块",
          "使用搜索框快速查找特定模块",
        ],
      },
      {
        id: "step-2",
        title: "添加模块到画布",
        description: "将模块添加到报告中",
        steps: [
          "在左侧导航中找到想要添加的模块",
          "双击模块名称，或点击模块右侧的添加按钮",
          "模块将自动添加到画布底部",
          "支持一次添加多个模块",
        ],
      },
      {
        id: "step-3",
        title: "调整模块布局",
        description: "自定义模块的位置和大小",
        steps: [
          "拖拽模块卡片的标题栏可以调整顺序",
          "拖拽卡片边缘可以调整大小",
          "点击模块选中后，可以在右侧配置面板调整参数",
        ],
      },
      {
        id: "step-4",
        title: "配置模块参数",
        description: "自定义模块的显示效果",
        steps: [
          "选中模块后，右侧面板显示该模块的配置选项",
          "可以调整图表类型、显示项、颜色等",
          "使用锁定功能可以让参数独立于全局设置",
        ],
      },
    ],
  },
  {
    id: "export-report",
    title: "导出报告",
    icon: <Download className="w-6 h-6" />,
    description: "将报告导出为专业的PDF文档",
    steps: [
      {
        id: "step-1",
        title: "打开导出弹窗",
        description: "开始导出流程",
        steps: [
          "确保报告已保存",
          "点击编辑器右上角的「导出」按钮",
          "弹出导出配置窗口",
        ],
      },
      {
        id: "step-2",
        title: "配置导出选项",
        description: "设置PDF文档格式",
        steps: [
          "选择纸张方向（A4纵向/横向）",
          "选择是否包含封面页",
          "选择是否生成目录",
          "选择是否显示页码",
        ],
      },
      {
        id: "step-3",
        title: "生成并下载",
        description: "等待PDF生成完成",
        steps: [
          "点击「开始导出」按钮",
          "等待系统生成PDF文档",
          "生成完成后自动下载",
          "也可以在导出历史中重新下载",
        ],
      },
    ],
  },
  {
    id: "use-template",
    title: "使用模板",
    icon: <Layout className="w-6 h-6" />,
    description: "快速从模板创建报告",
    steps: [
      {
        id: "step-1",
        title: "浏览模板库",
        description: "查看可用的报告模板",
        steps: [
          "在工作台点击「从模板创建」",
          "系统模板：官方预设的标准报告模板",
          "个人模板：您自己保存的模板",
          "支持按类型筛选（周报、月报、季报等）",
        ],
      },
      {
        id: "step-2",
        title: "预览模板",
        description: "查看模板的结构和效果",
        steps: [
          "点击模板卡片进入预览",
          "查看模板包含的模块和布局",
          "确认模板是否符合需求",
        ],
      },
      {
        id: "step-3",
        title: "使用模板创建报告",
        description: "基于模板开始新报告",
        steps: [
          "点击「使用此模板」按钮",
          "选择目标基金和分析参数",
          "系统自动创建包含模板结构的报告",
          "您可以在此基础上进行修改",
        ],
      },
      {
        id: "step-4",
        title: "保存为模板",
        description: "将当前报告保存为新模板",
        steps: [
          "在编辑器中打开要保存的报告",
          "点击右上角菜单的「保存为模板」",
          "输入模板名称、描述和分类",
          "模板将保存到个人模板库",
        ],
      },
    ],
  },
];

export default function GettingStartedPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["create-report"]);
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">快速入门</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          快速了解如何使用基金分析报告系统
        </p>
      </div>

      {/* Video Introduction */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-[var(--primary)] bg-opacity-10 rounded-lg flex items-center justify-center">
            <PlayCircle className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-[var(--foreground)]">
              观看入门视频
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              3分钟了解系统核心功能，快速上手报告制作
            </p>
          </div>
          <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm hover:opacity-90 transition-opacity">
            观看视频
          </button>
        </div>
      </Card>

      {/* Guide Sections */}
      <div className="space-y-4">
        {guideSections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);

          return (
            <Card key={section.id} className="overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-[var(--muted)] transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary)] bg-opacity-10 rounded-lg flex items-center justify-center text-[var(--primary)]">
                  {section.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-medium text-[var(--foreground)]">
                    {section.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {section.description}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-[var(--muted-foreground)]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" />
                )}
              </button>

              {isExpanded && (
                <div className="px-6 pb-6">
                  <div className="border-t border-[var(--border)] pt-4 space-y-3">
                    {section.steps.map((step, index) => {
                      const stepFullId = `${section.id}-${step.id}`;
                      const isStepExpanded = expandedSteps.includes(stepFullId);

                      return (
                        <div
                          key={step.id}
                          className="border border-[var(--border)] rounded-lg"
                        >
                          <button
                            onClick={() => toggleStep(stepFullId)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--muted)] transition-colors"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1 text-left">
                              <h4 className="font-medium text-[var(--foreground)]">
                                {step.title}
                              </h4>
                              <p className="text-sm text-[var(--muted-foreground)]">
                                {step.description}
                              </p>
                            </div>
                            {isStepExpanded ? (
                              <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
                            )}
                          </button>

                          {isStepExpanded && (
                            <div className="px-4 pb-4">
                              <ul className="ml-11 space-y-2">
                                {step.steps.map((instruction, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                                    <span>{instruction}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
