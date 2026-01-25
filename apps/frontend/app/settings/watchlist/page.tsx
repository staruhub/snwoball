"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { WatchlistTable } from "@/components/features/settings";
import { useUserStore } from "@/stores";
import { fetchApiAuth } from "@/lib/api/config";

interface FundGroup {
  id: string;
  group_name: string;
  group_code: string;
  fund_count: number;
}

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

export default function WatchlistPage() {
  const { token } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [fundsLoading, setFundsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteGroup, setFavoriteGroup] = useState<FundGroup | null>(null);
  const [funds, setFunds] = useState<Fund[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("请先登录");
        setLoading(false);
        return;
      }

      try {
        // 获取用户基金分组
        const groupsResponse = await fetchApiAuth<{
          items: FundGroup[];
          total: number;
        }>("/api/v1/user/fund-groups", token);

        // 查找 favorite 分组
        const favorite = groupsResponse.items.find(
          (g) => g.group_code === "favorite" || g.group_name === "自选" || g.group_name === "关注"
        );

        if (favorite) {
          setFavoriteGroup(favorite);
          // 获取分组内的基金
          setFundsLoading(true);
          const fundsResponse = await fetchApiAuth<{
            items: Fund[];
            total: number;
          }>(`/api/v1/user/fund-groups/${favorite.id}/funds?page_size=1000`, token);
          setFunds(fundsResponse.items);
        }
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || "获取数据失败");
      } finally {
        setLoading(false);
        setFundsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleRemoveFund = (fundId: string) => {
    setFunds((prev) => prev.filter((f) => f.id !== fundId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted-foreground)]">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted-foreground)]">请先登录</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">我的关注</h1>
        <p className="text-[var(--muted-foreground)]">管理您关注的基金</p>
      </div>

      <Card className="p-6">
        {favoriteGroup ? (
          <WatchlistTable
            token={token}
            groupId={favoriteGroup.id}
            funds={funds}
            loading={fundsLoading}
            onRemove={handleRemoveFund}
          />
        ) : (
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            <p>您还没有创建关注分组</p>
            <p className="text-sm mt-2">可在基金列表中添加基金到关注</p>
          </div>
        )}
      </Card>
    </div>
  );
}
