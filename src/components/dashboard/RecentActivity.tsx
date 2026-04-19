'use client';

import { Card, Timeline, Empty, Spin } from 'antd';
import { Phone, UserPlus, TrendingUp, FileText } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useStore } from '@/store';
import { formatRelativeTime } from '@/lib/format';

interface ActivityItem {
  id: string;
  type: 'follow_up' | 'new_customer' | 'product_purchase' | 'product_update';
  title: string;
  description: string;
  time: Date;
  icon: React.ReactNode;
  color: string;
}

export function RecentActivity() {
  const { currentUserId, viewMode } = useStore();

  const { data: recentFollowUps, isLoading } = trpc.followUp.recent.useQuery({
    salespersonId: viewMode === 'sales' ? currentUserId : undefined,
    limit: 8,
  });

  if (isLoading) {
    return (
      <Card title="最近活动" className="h-full">
        <div className="flex items-center justify-center h-64">
          <Spin />
        </div>
      </Card>
    );
  }

  // 将跟进记录转换为活动项
  const activities: ActivityItem[] = (recentFollowUps || []).map((followUp) => ({
    id: followUp.id,
    type: 'follow_up',
    title: `跟进了 ${followUp.customer.name}`,
    description: followUp.content.slice(0, 50) + (followUp.content.length > 50 ? '...' : ''),
    time: new Date(followUp.createdAt),
    icon: <Phone className="w-4 h-4" />,
    color: '#D97706',
  }));

  // 添加一些模拟的其他活动类型
  const mockActivities: ActivityItem[] = [
    {
      id: 'mock1',
      type: 'new_customer',
      title: '新增客户 王五',
      description: '风险偏好：稳健型',
      time: new Date(Date.now() - 1000 * 60 * 60 * 3),
      icon: <UserPlus className="w-4 h-4" />,
      color: '#16A34A',
    },
    {
      id: 'mock2',
      type: 'product_update',
      title: '产品净值更新',
      description: '稳健增长一号 净值 1.0523',
      time: new Date(Date.now() - 1000 * 60 * 60 * 5),
      icon: <TrendingUp className="w-4 h-4" />,
      color: '#2563EB',
    },
  ];

  const allActivities = [...activities, ...mockActivities]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 8);

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gold-600" />
          <span>最近活动</span>
        </div>
      }
      className="h-full"
    >
      {allActivities.length === 0 ? (
        <Empty description="暂无活动记录" />
      ) : (
        <Timeline
          items={allActivities.map((activity) => ({
            dot: (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${activity.color}20`, color: activity.color }}
              >
                {activity.icon}
              </div>
            ),
            children: (
              <div className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-warm-900 text-sm">{activity.title}</span>
                  <span className="text-xs text-warm-400">
                    {formatRelativeTime(activity.time)}
                  </span>
                </div>
                <p className="text-xs text-warm-500 mt-1">{activity.description}</p>
              </div>
            ),
          }))}
        />
      )}
    </Card>
  );
}
