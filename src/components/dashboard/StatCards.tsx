'use client';

import { TrendingUp, Briefcase, Users, PhoneCall } from 'lucide-react';
import { StatCard } from '@/components/common';
import { trpc } from '@/lib/trpc';
import { useStore } from '@/store';
import { Skeleton } from 'antd';
import { formatMoney } from '@/lib/format';

export function StatCards() {
  const { viewMode, currentUserId } = useStore();

  const { data, isLoading } = trpc.statistics.overview.useQuery({
    salespersonId: viewMode === 'sales' ? currentUserId : undefined,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-5">
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="AUM 总规模"
        value={formatMoney(data.totalAum)}
        suffix="亿"
        change={data.aumChange}
        changeLabel="较上月"
        icon={<TrendingUp className="w-6 h-6" />}
      />
      <StatCard
        title="产品数量"
        value={data.productCount}
        suffix="只"
        icon={<Briefcase className="w-6 h-6" />}
      />
      <StatCard
        title="客户数量"
        value={data.customerCount}
        suffix="位"
        icon={<Users className="w-6 h-6" />}
      />
      <StatCard
        title="本月跟进"
        value={`${data.followUpCount}/${data.followUpTarget}`}
        suffix="次"
        icon={<PhoneCall className="w-6 h-6" />}
      />
    </div>
  );
}
