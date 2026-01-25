"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { HeaderBar } from "@/components/features/header-bar";
import { FilterBar } from "@/components/features/filter-bar";
import { ConfigPanel } from "@/components/features/config-panel";
import { ExportModal } from "@/components/features/export";
import {
  ModuleWrapper,
  ModuleLoading,
  ModuleEmpty,
} from "@/components/modules/base";
import {
  moduleRegistry,
  type ModuleInstance,
} from "@/lib/modules";
import { getReport, type Report } from "@/lib/api/reports";

// 导入所有模块以触发注册
import "@/components/modules";

// 生成唯一 ID
function generateId(): string {
  return `mod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface EditorContentProps {
  /** 报告 ID，为 undefined 时表示新建模式 */
  reportId?: string;
}

export function EditorContent({ reportId }: EditorContentProps) {
  const router = useRouter();
  const isNewReport = !reportId;

  // 报告配置
  const [reportName, setReportName] = useState("未命名报告");
  const [fundProduct, setFundProduct] = useState("");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [benchmark, setBenchmark] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // 画布内容引用
  const canvasRef = useRef<HTMLDivElement>(null);

  // 画布上的模块实例
  const [moduleInstances, setModuleInstances] = useState<ModuleInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null
  );

  // 加载现有报告
  useEffect(() => {
    if (!isNewReport && reportId) {
      loadReport();
    }
  }, [reportId, isNewReport]);

  const loadReport = async () => {
    if (!reportId) return;
    try {
      const report = await getReport(reportId);
      if (report) {
        setReportName(report.name);
        if (report.fundId) {
          setFundProduct(report.fundId);
        }
      }
    } catch (error) {
      console.error("Failed to load report:", error);
    }
  };

  // 添加模块到画布
  const handleAddModule = useCallback((moduleId: string) => {
    const definition = moduleRegistry.getDefinition(moduleId);
    if (!definition) {
      console.error(`Module ${moduleId} not found`);
      return;
    }

    const instance: ModuleInstance = {
      instanceId: generateId(),
      moduleId,
      config: { ...definition.defaultConfig },
    };

    setModuleInstances((prev) => [...prev, instance]);
  }, []);

  // 删除模块
  const handleDeleteModule = useCallback((instanceId: string) => {
    setModuleInstances((prev) =>
      prev.filter((inst) => inst.instanceId !== instanceId)
    );
    setSelectedInstanceId((prev) => (prev === instanceId ? null : prev));
  }, []);

  // 复制模块
  const handleDuplicateModule = useCallback((instanceId: string) => {
    setModuleInstances((prev) => {
      const original = prev.find((inst) => inst.instanceId === instanceId);
      if (!original) return prev;

      const duplicate: ModuleInstance = {
        ...original,
        instanceId: generateId(),
        config: { ...original.config },
      };

      const index = prev.findIndex((inst) => inst.instanceId === instanceId);
      const next = [...prev];
      next.splice(index + 1, 0, duplicate);
      return next;
    });
  }, []);

  // 更新模块配置
  const handleConfigChange = useCallback(
    (instanceId: string, config: Record<string, unknown>) => {
      setModuleInstances((prev) =>
        prev.map((inst) =>
          inst.instanceId === instanceId ? { ...inst, config } : inst
        )
      );
    },
    []
  );

  // 选中的模块定义
  const selectedModule = useMemo(() => {
    if (!selectedInstanceId) return null;
    const instance = moduleInstances.find(
      (inst) => inst.instanceId === selectedInstanceId
    );
    if (!instance) return null;
    return {
      instance,
      definition: moduleRegistry.getDefinition(instance.moduleId),
    };
  }, [selectedInstanceId, moduleInstances]);

  // 打开配置面板
  const handleOpenConfig = useCallback((instanceId: string) => {
    setSelectedInstanceId(instanceId);
    setShowConfigPanel(true);
  }, []);

  // 获取导出内容 HTML
  const getContentHtml = useCallback(() => {
    if (!canvasRef.current) return "";
    return canvasRef.current.innerHTML;
  }, []);

  // 获取认证 Token
  const getToken = useCallback(() => {
    return localStorage.getItem("auth_token");
  }, []);

  // 返回工作台
  const handleBack = useCallback(() => {
    router.push("/workspace");
  }, [router]);

  // 日期范围字符串
  const dateRange = `${startDate} ~ ${endDate}`;

  // 动态生成目录项
  const tocItems = useMemo(() => {
    return moduleInstances.map((instance) => {
      const definition = moduleRegistry.getDefinition(instance.moduleId);
      return {
        id: instance.instanceId,
        title: definition?.name || instance.moduleId,
        level: 1,
      };
    });
  }, [moduleInstances]);

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Left Sidebar */}
      <Sidebar onModuleAdd={handleAddModule} />

      {/* Main Area */}
      <main className="flex flex-col flex-1 h-full">
        {/* Header Bar */}
        <HeaderBar
          reportName={reportName}
          onReportNameChange={setReportName}
          onExport={() => setShowExportModal(true)}
          onSave={() => console.log("Save clicked")}
          onBack={handleBack}
        />

        {/* Filter Bar */}
        <FilterBar
          fundProduct={fundProduct}
          startDate={startDate}
          endDate={endDate}
          benchmark={benchmark}
          frequency={frequency}
          onFundProductChange={setFundProduct}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onBenchmarkChange={setBenchmark}
          onFrequencyChange={setFrequency}
        />

        {/* Canvas Area */}
        <div ref={canvasRef} className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
          {moduleInstances.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-[var(--muted-foreground)]">
              <div className="text-center">
                <p className="text-lg mb-2">点击左侧模块添加到报告</p>
                <p className="text-sm">选择产品信息、收益统计、风险分析等模块</p>
              </div>
            </div>
          ) : (
            moduleInstances.map((instance) => {
              const definition = moduleRegistry.getDefinition(instance.moduleId);
              const Component = moduleRegistry.getComponent(instance.moduleId);

              if (!definition || !Component) {
                return (
                  <div
                    key={instance.instanceId}
                    className="p-4 border border-red-300 bg-red-50 text-red-600 rounded"
                  >
                    模块 {instance.moduleId} 未找到
                  </div>
                );
              }

              return (
                <ModuleWrapper
                  key={instance.instanceId}
                  definition={definition}
                  instance={instance}
                  isSelected={selectedInstanceId === instance.instanceId}
                  onSelect={() => setSelectedInstanceId(instance.instanceId)}
                  onDelete={() => handleDeleteModule(instance.instanceId)}
                  onDuplicate={() => handleDuplicateModule(instance.instanceId)}
                  onConfigOpen={() => handleOpenConfig(instance.instanceId)}
                >
                  <Component
                    instance={instance}
                    definition={definition}
                    fundId={fundProduct}
                    benchmarkId={benchmark}
                    startDate={startDate}
                    endDate={endDate}
                    onConfigChange={(config) =>
                      handleConfigChange(instance.instanceId, config)
                    }
                  />
                </ModuleWrapper>
              );
            })
          )}
        </div>
      </main>

      {/* Right Config Panel */}
      {showConfigPanel && selectedModule && (
        <ConfigPanel
          onClose={() => setShowConfigPanel(false)}
          moduleId={selectedModule.instance.moduleId}
          moduleName={selectedModule.definition?.name}
          config={selectedModule.instance.config}
          onConfigChange={(config) =>
            handleConfigChange(selectedModule.instance.instanceId, config)
          }
        />
      )}

      {/* Export Modal */}
      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        reportName={reportName}
        fundName={fundProduct}
        dateRange={dateRange}
        getContentHtml={getContentHtml}
        getToken={getToken}
        tocItems={tocItems}
      />
    </div>
  );
}
