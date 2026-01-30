"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  useFunds,
  useBenchmarks,
  useSearchFunds,
  invalidateAllCache,
} from "@/hooks";

/**
 * 测试页面：验证缓存和搜索功能
 */
export default function TestCachePage() {
  const [searchKeyword, setSearchKeyword] = useState("");

  // 测试基金列表缓存
  const { data: fundsData, isLoading: fundsLoading } = useFunds({
    page: 1,
    page_size: 10,
  });

  // 测试基准列表缓存
  const { data: benchmarks, isLoading: benchmarksLoading } = useBenchmarks();

  // 测试搜索（带防抖和取消）
  const { results: searchResults, isSearching } = useSearchFunds(searchKeyword);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">缓存与搜索功能测试</h1>

      {/* 控制按钮 */}
      <div className="mb-8 space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          刷新页面（测试缓存持久性）
        </button>
        <button
          onClick={() => invalidateAllCache()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          清空所有缓存
        </button>
      </div>

      {/* 基金列表测试 */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          1. 基金列表缓存测试 (TTL: 5分钟)
        </h2>
        {fundsLoading ? (
          <p className="text-gray-500">加载中...</p>
        ) : (
          <div>
            <p className="mb-2">
              共 {fundsData?.total || 0} 只基金，显示前{" "}
              {fundsData?.items?.length || 0} 只
            </p>
            <p className="text-sm text-gray-600">
              提示：多次点击刷新按钮，观察网络请求是否被缓存
            </p>
          </div>
        )}
      </section>

      {/* 基准列表测试 */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          2. 基准列表缓存测试 (TTL: 30分钟)
        </h2>
        {benchmarksLoading ? (
          <p className="text-gray-500">加载中...</p>
        ) : (
          <div>
            <p className="mb-2">共 {benchmarks?.length || 0} 个基准</p>
            <ul className="space-y-1 text-sm">
              {benchmarks?.slice(0, 5).map((b) => (
                <li key={b.id}>
                  {b.name} ({b.code})
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              提示：基准数据缓存时间更长（30分钟）
            </p>
          </div>
        )}
      </section>

      {/* 搜索测试 */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          3. 搜索功能测试（防抖 300ms + 请求取消）
        </h2>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="输入基金名称或代码搜索..."
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
        />
        {isSearching ? (
          <p className="text-gray-500">搜索中...</p>
        ) : searchResults ? (
          <div>
            <p className="mb-2">找到 {searchResults.total} 个结果</p>
            <ul className="space-y-1 text-sm">
              {searchResults.items?.slice(0, 5).map((fund) => (
                <li key={fund.id}>
                  {fund.name} ({fund.code})
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              提示：快速输入多个字符，观察请求是否被防抖和取消
            </p>
          </div>
        ) : (
          <p className="text-gray-500">输入关键词开始搜索</p>
        )}
      </section>

      {/* 验证清单 */}
      <section className="p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">验证清单</h2>
        <ul className="space-y-2 text-sm">
          <li>
            ✅ <strong>缓存命中</strong>: 连续刷新页面，观察网络面板，确认相同请求只发起一次
          </li>
          <li>
            ✅ <strong>请求去重</strong>: 打开多个相同页面，确认并发请求共享结果
          </li>
          <li>
            ✅ <strong>搜索防抖</strong>: 快速输入字符，确认在停止输入后 300ms
            才发起请求
          </li>
          <li>
            ✅ <strong>请求取消</strong>: 快速切换搜索词，确认旧请求被
            abort（网络面板显示 canceled）
          </li>
          <li>
            ✅ <strong>错误日志</strong>: 打开控制台，查看错误日志格式
          </li>
        </ul>
      </section>
    </div>
  );
}
