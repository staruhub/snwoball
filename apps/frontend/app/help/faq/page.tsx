"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronRight, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqCategories = [
  { id: "all", name: "全部问题" },
  { id: "account", name: "账户相关" },
  { id: "report", name: "报告制作" },
  { id: "module", name: "分析模块" },
  { id: "export", name: "导出功能" },
  { id: "template", name: "模板管理" },
  { id: "data", name: "数据问题" },
];

const faqList: FAQ[] = [
  // 账户相关
  {
    id: "faq-1",
    question: "如何修改登录密码？",
    answer:
      "进入【个人中心】-【账户设置】页面，在密码修改区域输入当前密码和新密码，点击确认即可完成修改。建议使用包含大小写字母、数字和特殊字符的强密码。",
    category: "account",
  },
  {
    id: "faq-2",
    question: "忘记密码如何找回？",
    answer:
      "在登录页面点击「忘记密码」链接，输入注册时使用的手机号或邮箱，系统将发送验证码。验证通过后即可设置新密码。如遇问题，请联系客服。",
    category: "account",
  },
  {
    id: "faq-3",
    question: "如何修改绑定的手机号？",
    answer:
      "进入【个人中心】-【账户设置】页面，在手机绑定区域点击「修改」，需要先验证当前手机号，然后输入新手机号并完成验证即可。",
    category: "account",
  },

  // 报告制作
  {
    id: "faq-4",
    question: "如何创建新报告？",
    answer:
      "有以下几种方式：1) 在工作台点击「新建报告」按钮；2) 从顶部导航选择「新建-空白报告」；3) 从模板创建，选择合适的模板快速开始。创建后会自动进入编辑器页面。",
    category: "report",
  },
  {
    id: "faq-5",
    question: "报告会自动保存吗？",
    answer:
      "是的，系统支持自动保存功能。默认每60秒自动保存一次。您也可以随时点击右上角的「保存」按钮手动保存。编辑器左上角会显示保存状态。",
    category: "report",
  },
  {
    id: "faq-6",
    question: "如何复制/克隆现有报告？",
    answer:
      "在报告列表页面，点击报告卡片右上角的更多菜单(...)，选择「复制报告」。复制后的报告会以「原报告名称-副本」命名，您可以自行修改。",
    category: "report",
  },
  {
    id: "faq-7",
    question: "误删了报告如何恢复？",
    answer:
      "删除的报告会进入回收站，保留30天。进入【报告管理】-【回收站】，找到要恢复的报告点击「还原」即可。超过30天的报告将被永久删除，无法恢复。",
    category: "report",
  },

  // 分析模块
  {
    id: "faq-8",
    question: "如何添加分析模块到报告中？",
    answer:
      "在编辑器左侧的模块导航面板中浏览所有可用模块。双击模块名称或点击右侧的添加按钮，即可将模块添加到画布中。您可以通过搜索框快速查找特定模块。",
    category: "module",
  },
  {
    id: "faq-9",
    question: "模块参数的锁定功能是什么？",
    answer:
      "模块参数默认会跟随全局筛选条件（如日期范围、业绩基准等）变化。如果您想让某个模块使用独立的参数设置，可以点击参数旁的锁图标进行锁定。锁定后该参数不再跟随全局变化。",
    category: "module",
  },
  {
    id: "faq-10",
    question: "如何调整模块的顺序和大小？",
    answer:
      "拖拽模块卡片的标题栏可以调整顺序。将鼠标移至卡片边缘出现调整光标后拖拽可以改变大小。也可以在右侧配置面板中直接输入宽度和高度数值。",
    category: "module",
  },

  // 导出功能
  {
    id: "faq-11",
    question: "支持哪些导出格式？",
    answer:
      "目前系统支持导出为PDF格式，支持A4纵向和横向两种页面方向。Word和PPT格式将在后续版本中支持。",
    category: "export",
  },
  {
    id: "faq-12",
    question: "导出的PDF图表是否清晰？",
    answer:
      "是的，系统在导出时会将图表转换为高分辨率图片（300dpi），确保打印效果清晰。同时会优化图表配色，保证打印后的可读性。",
    category: "export",
  },
  {
    id: "faq-13",
    question: "导出需要多长时间？",
    answer:
      "导出时间取决于报告的模块数量和复杂度。一般10页以内的报告约需10-30秒。导出过程中请保持网络连接稳定。您可以在导出弹窗中看到实时进度。",
    category: "export",
  },

  // 模板管理
  {
    id: "faq-14",
    question: "如何将报告保存为模板？",
    answer:
      "在编辑器中打开要保存为模板的报告，点击右上角菜单选择「保存为模板」，输入模板名称、描述和分类后保存。模板会保存到您的个人模板库中。",
    category: "template",
  },
  {
    id: "faq-15",
    question: "系统模板和个人模板有什么区别？",
    answer:
      "系统模板是官方预设的标准报告模板，经过专业设计，所有用户可用。个人模板是用户自己创建和保存的模板，仅本人可见和使用。",
    category: "template",
  },
  {
    id: "faq-16",
    question: "可以分享自己的模板给同事吗？",
    answer:
      "个人模板目前不支持直接分享。如需团队共享模板，可以联系管理员将模板添加到系统模板库，或等待后续版本的团队协作功能。",
    category: "template",
  },

  // 数据问题
  {
    id: "faq-17",
    question: "数据多久更新一次？",
    answer:
      "基金净值数据每个交易日收盘后更新，通常在当晚20:00前完成。持仓数据按季度更新，通常在季报披露后一周内更新。",
    category: "data",
  },
  {
    id: "faq-18",
    question: "为什么某些基金查不到数据？",
    answer:
      "可能原因：1) 基金代码输入错误；2) 新成立基金数据尚未收录；3) 私募基金需要授权才能查看。如确认代码正确但仍查不到，请联系客服反馈。",
    category: "data",
  },
  {
    id: "faq-19",
    question: "数据来源是什么？",
    answer:
      "系统数据来源于中国证监会、中国基金业协会、各大基金公司官方披露，以及权威第三方数据提供商。数据经过多重校验确保准确性。",
    category: "data",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([]);

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQs((prev) =>
      prev.includes(faqId) ? prev.filter((id) => id !== faqId) : [...prev, faqId]
    );
  };

  // Filter FAQs
  const filteredFAQs = faqList.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">常见问题</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          查找常见问题的解答
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="搜索问题..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {faqCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <Card className="p-6">
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                未找到相关问题
              </h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                尝试使用不同的关键词搜索，或联系客服获取帮助
              </p>
            </div>
          </Card>
        ) : (
          filteredFAQs.map((faq) => {
            const isExpanded = expandedFAQs.includes(faq.id);
            const categoryInfo = faqCategories.find((c) => c.id === faq.category);

            return (
              <Card key={faq.id} className="overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-5 py-4 flex items-start gap-4 hover:bg-[var(--muted)] transition-colors text-left"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-[var(--primary)]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--foreground)]">
                      {faq.question}
                    </h3>
                    {!isExpanded && (
                      <div className="flex items-center gap-2 mt-2">
                        <Tag className="w-3 h-3 text-[var(--muted-foreground)]" />
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {categoryInfo?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5">
                    <div className="pl-9 pt-2 border-t border-[var(--border)]">
                      <p className="text-[var(--foreground)] leading-relaxed mt-3">
                        {faq.answer}
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <Tag className="w-3 h-3 text-[var(--muted-foreground)]" />
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {categoryInfo?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Help Card */}
      <Card className="p-6 bg-[var(--primary)] bg-opacity-5 border-[var(--primary)] border-opacity-20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-[var(--foreground)]">没有找到答案？</h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              联系我们的客服团队获取帮助
            </p>
          </div>
          <a
            href="/help/contact"
            className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm hover:opacity-90 transition-opacity"
          >
            联系客服
          </a>
        </div>
      </Card>
    </div>
  );
}
