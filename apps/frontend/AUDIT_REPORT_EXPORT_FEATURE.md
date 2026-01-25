# Code Audit Report - PDF Export Feature

**Date**: 2026-01-25
**Auditor**: Senior Code Audit Expert
**Code Reviewed**: PDF Export Feature Implementation

---

## Executive Summary

本次审查对 PDF 导出功能的代码实现进行了全面分析，涵盖 6 个主要文件和 2 个辅助模板文件。整体而言，代码结构清晰、类型定义完整，遵循了 React/Next.js 的基本最佳实践。

**发现统计:**
- 严重问题 (Critical): 2
- 高优先级问题 (High): 3
- 中优先级问题 (Medium): 5
- 低优先级问题 (Low): 4

**主要风险领域:**
1. HTML 模板生成存在 XSS 注入风险
2. Token 管理存在安全隐患
3. 内存管理和资源清理需要优化

---

## Critical Issues

### Issue #1: XSS 漏洞 - HTML 模板未转义用户输入

- **Severity**: Critical
- **Category**: Security
- **Location**:
  - `/components/features/export/cover-page-template.tsx` (Lines 102-156)
  - `/components/features/export/toc-template.tsx` (Lines 92-141)
- **Description**:
  `generateCoverHtml` 和 `generateTocHtml` 函数直接将用户输入（如 `reportTitle`、`fundName`、`dateRange`、`item.title`）插入 HTML 字符串模板中，未进行任何转义处理。攻击者可以通过在报告名称或基金名称中注入恶意脚本来执行 XSS 攻击。

  ```typescript
  // cover-page-template.tsx - 危险代码
  <h1 ...>${props.reportTitle}</h1>  // 未转义
  ${props.fundName ? `<div ...>${props.fundName}</div>` : ""}  // 未转义

  // toc-template.tsx - 危险代码
  <span ...>${index + 1}. ${item.title}</span>  // 未转义
  ```

- **Impact**:
  - 攻击者可以注入恶意 JavaScript 代码
  - 可能导致用户会话劫持、数据窃取
  - 在 PDF 生成服务端可能造成服务器端漏洞

- **Recommendation**:
  创建并使用 HTML 实体转义函数处理所有用户输入

- **Example Fix**:
  ```typescript
  // lib/utils/escape-html.ts
  export function escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 使用示例
  import { escapeHtml } from "@/lib/utils/escape-html";

  export function generateCoverHtml(props: CoverPageProps): string {
    const safeTitle = escapeHtml(props.reportTitle);
    const safeFundName = props.fundName ? escapeHtml(props.fundName) : "";
    // ...
  }
  ```

---

### Issue #2: 硬编码 Demo Token 作为后备值

- **Severity**: Critical
- **Category**: Security
- **Location**: `/app/editor/[id]/page.tsx` (Lines 157-159)
- **Description**:
  `getToken` 函数在无法从 localStorage 获取 token 时返回硬编码的 `"demo-token"`：
  ```typescript
  const getToken = useCallback(() => {
    return localStorage.getItem("auth_token") || "demo-token";
  }, []);
  ```
  这意味着即使用户未登录，也可能发送带有 demo token 的 API 请求。

- **Impact**:
  - 可能绕过认证检查
  - 如果后端接受此 demo token，可能导致未授权访问
  - 在生产环境中造成安全隐患

- **Recommendation**:
  - 移除硬编码的 demo token
  - 如果 token 不存在，应返回 null 并在调用处进行适当处理
  - 考虑使用环境变量区分开发和生产环境

- **Example Fix**:
  ```typescript
  const getToken = useCallback(() => {
    return localStorage.getItem("auth_token");
  }, []);
  ```
  调用处的检查已经存在 (export-modal.tsx Lines 91-101)，会在 token 为 null 时显示错误提示。

---

## High Priority Issues

### Issue #3: 导出过程中缺乏取消机制

- **Severity**: High
- **Category**: Performance / UX
- **Location**: `/components/features/export/export-modal.tsx` (Lines 78-165)
- **Description**:
  `handleExport` 是一个 async 函数，一旦开始执行就无法中断。当用户关闭弹窗时（通过 `handleClose`），虽然 UI 会重置，但后台的 API 请求仍会继续执行。

- **Impact**:
  - 用户无法取消正在进行的导出操作
  - 组件卸载后可能尝试更新已卸载组件的状态，导致内存泄漏或控制台警告
  - 浪费服务器资源

- **Recommendation**:
  使用 AbortController 实现请求取消功能

- **Example Fix**:
  ```typescript
  // 在组件中添加 AbortController ref
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleExport = useCallback(async () => {
    // 取消之前的请求
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const blob = await exportReportPdf(
        { /* ... */ },
        token,
        abortControllerRef.current.signal  // 传递 signal
      );
      // ...
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // 被取消的请求，不处理
      }
      // 其他错误处理
    }
  }, [/* deps */]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);
  ```

---

### Issue #4: localStorage 数据解析缺乏验证

- **Severity**: High
- **Category**: Security / Robustness
- **Location**: `/hooks/use-export-templates.ts` (Lines 21-30)
- **Description**:
  从 localStorage 读取模板数据时，直接使用 `JSON.parse` 解析，没有验证数据结构是否符合 `ExportTemplate[]` 类型。恶意数据或损坏的数据可能导致运行时错误。

  ```typescript
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    setUserTemplates(JSON.parse(stored));  // 未验证数据结构
  }
  ```

- **Impact**:
  - 损坏的数据可能导致应用崩溃
  - 恶意数据可能导致意外行为
  - 可能注入非法的模板配置

- **Recommendation**:
  添加数据验证逻辑，使用 Zod 或手动验证

- **Example Fix**:
  ```typescript
  function isValidTemplate(data: unknown): data is ExportTemplate {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof (data as ExportTemplate).id === 'string' &&
      typeof (data as ExportTemplate).name === 'string' &&
      typeof (data as ExportTemplate).isSystem === 'boolean'
    );
  }

  function parseTemplates(stored: string): ExportTemplate[] {
    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isValidTemplate);
    } catch {
      return [];
    }
  }
  ```

---

### Issue #5: 目录项硬编码而非动态生成

- **Severity**: High
- **Category**: Logic / Functionality
- **Location**: `/app/editor/[id]/page.tsx` (Lines 275-278)
- **Description**:
  传递给 `ExportModal` 的 `tocItems` 是硬编码的，而不是根据实际添加到画布上的模块动态生成：
  ```typescript
  tocItems={[
    { id: "returns", title: "区间收益", level: 1 },
    { id: "sharpe", title: "滚动夏普比率", level: 1 },
  ]}
  ```

- **Impact**:
  - 导出的 PDF 目录与实际内容不匹配
  - 用户添加或删除模块后，目录不会更新
  - 严重影响导出功能的实用性

- **Recommendation**:
  根据 `moduleInstances` 动态生成 tocItems

- **Example Fix**:
  ```typescript
  const tocItems = useMemo(() => {
    return moduleInstances.map((instance, index) => {
      const definition = moduleRegistry.getDefinition(instance.moduleId);
      return {
        id: instance.instanceId,
        title: definition?.name || instance.moduleId,
        level: 1,
      };
    });
  }, [moduleInstances]);
  ```

---

## Medium Priority Issues

### Issue #6: 缺少导出过程的加载状态锁定

- **Severity**: Medium
- **Category**: UX / Logic
- **Location**: `/components/features/export/export-modal.tsx` (Lines 70-75)
- **Description**:
  虽然 `handleClose` 在导出进行中会阻止关闭，但用户仍然可以通过点击 Modal 外部区域来触发关闭。需要确认 Modal 组件是否正确处理了这种情况。

- **Impact**:
  - 用户可能意外关闭正在进行的导出
  - 导致不一致的用户体验

- **Recommendation**:
  在 Modal 组件中传递 `closeOnOverlayClick={false}` 或在导出过程中禁用关闭功能

---

### Issue #7: 文件名未进行安全处理

- **Severity**: Medium
- **Category**: Security
- **Location**: `/components/features/export/export-modal.tsx` (Lines 137, 147)
- **Description**:
  文件名直接使用用户输入的 `config.reportName`，未过滤特殊字符：
  ```typescript
  file_name: `${config.reportName}.pdf`,
  downloadBlob(blob, `${config.reportName}.pdf`);
  ```

- **Impact**:
  - 某些特殊字符可能在不同操作系统上导致问题
  - 可能包含路径遍历字符（如 `../`）

- **Recommendation**:
  添加文件名清理函数

- **Example Fix**:
  ```typescript
  function sanitizeFileName(name: string): string {
    return name
      .replace(/[<>:"/\\|?*]/g, '_')  // 移除非法字符
      .replace(/\.{2,}/g, '.')        // 移除连续的点
      .trim()
      .slice(0, 200);                  // 限制长度
  }
  ```

---

### Issue #8: 导出范围选择逻辑未实现

- **Severity**: Medium
- **Category**: Logic / Functionality
- **Location**: `/components/features/export/export-modal.tsx` (Lines 125-126)
- **Description**:
  虽然 UI 提供了"全部模块"和"选中模块"的选项，但 `getContentHtml()` 函数始终返回整个画布的内容，并未根据 `config.exportScope` 过滤内容。

- **Impact**:
  - "选中模块"导出选项实际上不起作用
  - 用户期望与实际行为不符

- **Recommendation**:
  修改 `getContentHtml` 函数以支持按选中模块过滤，或在当前版本中禁用该选项

---

### Issue #9: useCallback 依赖项不完整

- **Severity**: Medium
- **Category**: Code Quality
- **Location**: `/app/editor/[id]/page.tsx` (Line 59)
- **Description**:
  `loadReport` 函数在 useEffect 中被调用，但它依赖于 `reportId`，而 useEffect 的依赖数组中没有包含 `loadReport` 本身：
  ```typescript
  useEffect(() => {
    if (!isNewReport) {
      loadReport();  // loadReport 使用了 reportId
    }
  }, [reportId, isNewReport]);  // loadReport 未包含在依赖中
  ```

- **Impact**:
  - 可能导致 ESLint exhaustive-deps 警告
  - 如果 loadReport 被 useCallback 包装，可能导致过时闭包问题

- **Recommendation**:
  将 `loadReport` 包装在 useCallback 中并添加到依赖数组

---

### Issue #10: 缺少导出配置的持久化

- **Severity**: Medium
- **Category**: UX
- **Location**: `/components/features/export/export-modal.tsx` (Lines 40-44)
- **Description**:
  每次打开导出弹窗时，配置都会重置为默认值。用户的上一次导出设置不会被保存。

- **Impact**:
  - 用户每次导出都需要重新配置
  - 降低用户体验

- **Recommendation**:
  考虑将最后使用的配置保存到 localStorage

---

## Low Priority Issues

### Issue #11: 进度条百分比不够精确

- **Severity**: Low
- **Category**: UX
- **Location**: `/components/features/export/export-progress.tsx` (Lines 83-115)
- **Description**:
  进度百分比是硬编码的固定值（preparing: 10%, generating: 50%, done: 100%），不反映实际进度。

- **Impact**:
  - 用户可能觉得进度条不准确
  - 对于大型报告，用户无法了解真实进度

- **Recommendation**:
  如果后端支持，可以实现真实进度追踪；否则考虑使用不确定进度条样式

---

### Issue #12: React 组件 key 使用 index

- **Severity**: Low
- **Category**: Code Quality
- **Location**: `/components/features/export/toc-template.tsx` (Line 47)
- **Description**:
  虽然这里使用了 `item.id` 作为 key（正确），但在 `generateTocHtml` 中使用 `map` 的 index 来显示序号，如果列表顺序变化可能导致编号错误。

- **Impact**:
  - 轻微的维护性问题

- **Recommendation**:
  当前实现是可接受的，但要注意未来如果添加排序功能

---

### Issue #13: 类型断言使用不一致

- **Severity**: Low
- **Category**: Code Quality
- **Location**: `/components/features/export/export-form.tsx` (Lines 75-77, 85-87, 96-97)
- **Description**:
  多处使用 `as ExportConfig["xxx"]` 类型断言：
  ```typescript
  updateConfig("exportType", value as ExportConfig["exportType"])
  updateConfig("pageSize", value as ExportConfig["pageSize"])
  ```

- **Impact**:
  - 降低类型安全性
  - 如果传入非法值，运行时才会发现

- **Recommendation**:
  考虑使用泛型或在 RadioGroup 组件中添加类型约束

---

### Issue #14: 控制台日志保留在生产代码中

- **Severity**: Low
- **Category**: Code Quality
- **Location**:
  - `/components/features/export/export-modal.tsx` (Line 149)
  - `/app/editor/[id]/page.tsx` (Line 181)
- **Description**:
  存在 `console.error` 和 `console.log` 语句：
  ```typescript
  console.error("Export failed:", error);
  onSave={() => console.log("Save clicked")}
  ```

- **Impact**:
  - 生产环境中不必要的日志输出
  - 可能泄露敏感信息

- **Recommendation**:
  - 使用统一的日志服务
  - 移除占位的 console.log
  - 考虑在生产构建中移除 console 语句

---

## Positive Findings

1. **良好的组件拆分**: 导出功能被合理地拆分为 ExportModal、ExportForm、ExportProgress 三个组件，职责清晰。

2. **完整的 TypeScript 类型定义**: `types.ts` 文件提供了完整的类型定义，包括导出配置、模板、进度状态等。

3. **合理的错误处理**: 导出流程中的错误被捕获并以用户友好的方式显示，包括重试功能。

4. **良好的 Hook 封装**: `useExportTemplates` Hook 很好地封装了模板管理逻辑，包括 localStorage 持久化。

5. **清晰的模块导出**: `index.ts` 文件提供了清晰的模块导出接口，便于外部使用。

6. **合理的默认配置**: `DEFAULT_EXPORT_CONFIG` 提供了合理的默认值，减少用户配置负担。

7. **响应式 UI 状态管理**: 使用 React 状态正确管理导出进度和错误状态。

8. **API 抽象层**: `lib/api/export.ts` 正确抽象了 API 调用逻辑，包括错误处理和 Blob 下载。

---

## Recommendations Summary

### 立即修复 (Critical)
1. 实现 HTML 转义函数，修复所有模板生成中的 XSS 漏洞
2. 移除硬编码的 demo-token，确保生产环境安全

### 近期修复 (High)
3. 实现导出取消功能，使用 AbortController
4. 添加 localStorage 数据验证
5. 动态生成目录项，根据实际模块内容

### 计划修复 (Medium)
6. 确认 Modal 关闭行为在导出过程中的处理
7. 添加文件名清理函数
8. 实现或禁用"选中模块"导出功能
9. 修复 useCallback/useEffect 依赖问题
10. 考虑添加配置持久化

### 优化改进 (Low)
11. 改进进度显示的准确性
12. 统一类型处理方式
13. 配置生产环境日志策略

---

## Additional Notes

### 假设
- 假设后端 PDF 生成服务已对 HTML 输入进行了额外的安全处理，但前端仍应进行转义作为防御性编程
- 假设 Modal 组件支持 `closeOnOverlayClick` 属性或类似功能

### 需要澄清的问题
1. 后端 PDF 服务是否有输入长度限制？
2. 是否需要支持大型报告的分批导出？
3. "选中模块"功能的预期行为是什么？是否计划在后续版本实现？

### 测试建议
1. 添加针对 XSS 注入的单元测试
2. 测试大型报告（100+ 模块）的导出性能
3. 测试网络中断时的错误处理
4. 测试组件卸载时的内存清理

---

**Risk Assessment**: High
**Recommended Next Steps**:
1. 立即修复 XSS 漏洞（Issue #1）
2. 移除 demo-token（Issue #2）
3. 实现动态目录生成（Issue #5）
4. 添加导出取消功能（Issue #3）
