'use client';

import { Layout } from '@/components/layout';
import {
  StatCards,
  AumTrendChart,
  ProductTypePie,
  ServiceTrendChart,
  CustomerServiceRank,
  ServiceTypePie,
  TeamRankChart,
  RecentActivity,
} from '@/components/dashboard';
import { useStore } from '@/store';

export default function DashboardPage() {
  const { viewMode } = useStore();

  return (
    <Layout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-warm-900">数据概览</h1>
        </div>

        {/* 统计卡片 */}
        <StatCards />

        {/* 通用图表 - AUM趋势 + 产品分布 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AumTrendChart />
          <ProductTypePie />
        </div>

        {/* 视角相关图表 */}
        {viewMode === 'sales' ? (
          // 销售视角：服务统计 + 最近活动
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ServiceTrendChart />
            <CustomerServiceRank />
            <RecentActivity />
          </div>
        ) : (
          // 团队长视角：团队排行 + 最近活动
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TeamRankChart />
            <RecentActivity />
          </div>
        )}
      </div>
    </Layout>
  );
}
