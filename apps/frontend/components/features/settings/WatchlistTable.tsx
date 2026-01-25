"use client";

import { useState } from "react";
import { Heart, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/form";
import { ConfirmModal } from "@/components/ui/modal";
import { fetchApiAuth } from "@/lib/api/config";

interface Fund {
  id: string;
  name: string;
  code: string;
  short_name: string | null;
  fund_type: string | null;
  fund_manager: string | null;
  current_nav: number | null;
  cumulative_return: number | null;
}

interface WatchlistTableProps {
  token: string;
  groupId: string;
  funds: Fund[];
  loading: boolean;
  onRemove: (fundId: string) => void;
}

export function WatchlistTable({
  token,
  groupId,
  funds,
  loading,
  onRemove,
}: WatchlistTableProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    fundId: string | null;
    fundName: string;
  }>({ open: false, fundId: null, fundName: "" });

  const filteredFunds = funds.filter(
    (fund) =>
      fund.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      fund.code?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleRemoveClick = (fundId: string, fundName: string) => {
    setConfirmModal({ open: true, fundId, fundName });
  };

  const handleConfirmRemove = async () => {
    const fundId = confirmModal.fundId;
    if (!fundId) return;

    setConfirmModal({ open: false, fundId: null, fundName: "" });
    setRemovingId(fundId);

    try {
      await fetchApiAuth(
        `/api/v1/user/fund-groups/${groupId}/funds/${fundId}`,
        token,
        { method: "DELETE" }
      );
      onRemove(fundId);
    } catch (error) {
      console.error("取消关注失败:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const formatReturn = (value: number | null) => {
    if (value === null || value === undefined) return "-";
    const formatted = value.toFixed(2);
    const className =
      value > 0
        ? "text-green-600 dark:text-green-400"
        : value < 0
        ? "text-red-600 dark:text-red-400"
        : "";
    return <span className={className}>{value > 0 ? "+" : ""}{formatted}%</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted-foreground)]">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索基金名称或代码"
            className="pl-9"
          />
        </div>
        <span className="text-sm text-[var(--muted-foreground)]">
          共 {filteredFunds.length} 只基金
        </span>
      </div>

      {/* 表格 */}
      {filteredFunds.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-[var(--muted-foreground)]">
          <Heart className="w-12 h-12 mb-4 opacity-20" />
          <p>暂无关注的基金</p>
          <p className="text-sm">可在基金列表中添加关注</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
                  基金名称
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
                  基金代码
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
                  最新净值
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
                  累计收益
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFunds.map((fund) => (
                <tr
                  key={fund.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--muted)]/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {fund.name || fund.short_name || "-"}
                      </p>
                      {fund.fund_manager && (
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {fund.fund_manager}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-[var(--foreground)]">
                    {fund.code || "-"}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-[var(--foreground)]">
                    {fund.current_nav?.toFixed(4) || "-"}
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    {formatReturn(fund.cumulative_return)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleRemoveClick(fund.id, fund.name || fund.short_name || fund.code || "")}
                      disabled={removingId === fund.id}
                      className="p-1.5 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                      title="取消关注"
                    >
                      {removingId === fund.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 确认取消关注弹窗 */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, fundId: null, fundName: "" })}
        onConfirm={handleConfirmRemove}
        title="取消关注"
        message={`确定要取消关注「${confirmModal.fundName}」吗？`}
        confirmText="确认取消"
        cancelText="暂不操作"
        variant="danger"
      />
    </div>
  );
}
