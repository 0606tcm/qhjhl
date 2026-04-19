'use client';

import { useState } from 'react';
import { Drawer, Descriptions, Spin, Empty, Tabs } from 'antd';
import { X, User } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useStore } from '@/store';
import { RiskPreferenceTag } from '@/components/common';
import { formatAmount, formatDate, maskPhone } from '@/lib/format';
import { HoldingsList } from './HoldingsList';
import { FollowUpTimeline } from './FollowUpTimeline';
import { FollowUpForm } from './FollowUpForm';
import { CustomerTags } from './CustomerTags';
import type { RiskPreference } from '@/types';

export function CustomerDrawer() {
  const { drawerOpen, drawerType, drawerEntityId, closeDrawer } = useStore();
  const [followUpFormOpen, setFollowUpFormOpen] = useState(false);
  const isOpen = drawerOpen && drawerType === 'customer' && !!drawerEntityId;

  const { data, isLoading } = trpc.customer.byId.useQuery(
    { id: drawerEntityId ?? '' },
    { enabled: !!drawerEntityId && drawerType === 'customer' }
  );

  const tabItems = data
    ? [
        {
          key: 'holdings',
          label: `持仓产品 (${data.holdings?.length || 0})`,
          children: <HoldingsList holdings={data.holdings || []} />,
        },
        {
          key: 'followUps',
          label: `跟进记录 (${data.followUps?.length || 0})`,
          children: (
            <FollowUpTimeline
              followUps={data.followUps || []}
              onAddFollowUp={() => setFollowUpFormOpen(true)}
            />
          ),
        },
      ]
    : [];

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">客户详情</span>
          </div>
        }
        placement="right"
        width={520}
        onClose={closeDrawer}
        open={isOpen}
        closeIcon={<X className="w-5 h-5 text-warm-500" />}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* 客户头像和名称 */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center">
                <User className="w-8 h-8 text-gold-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-warm-900">{data.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-warm-500">{maskPhone(data.phone)}</span>
                  <RiskPreferenceTag preference={data.riskPreference as RiskPreference} />
                </div>
              </div>
            </div>

            {/* 客户标签 */}
            <div className="bg-warm-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-warm-700 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-gold-600 rounded"></span>
                客户标签
              </h3>
              <CustomerTags customerId={data.id} customerTags={data.tags || []} />
            </div>

            {/* 基本信息 */}
            <div className="bg-warm-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-warm-700 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-gold-600 rounded"></span>
                基本信息
              </h3>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="总持仓">
                  <span className="font-mono font-medium">{formatAmount(data.totalAssets)}</span>
                </Descriptions.Item>
                <Descriptions.Item label="持有产品">
                  <span>{data.holdings?.length || 0}只</span>
                </Descriptions.Item>
                <Descriptions.Item label="客户经理">{data.salesperson?.name}</Descriptions.Item>
                <Descriptions.Item label="入档时间">{formatDate(data.createdAt)}</Descriptions.Item>
                {data.email && (
                  <Descriptions.Item label="邮箱" span={2}>
                    {data.email}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            {/* 持仓和跟进记录 */}
            <Tabs items={tabItems} />
          </div>
        ) : (
          <Empty description="客户不存在" />
        )}
      </Drawer>

      {/* 新增跟进记录表单 */}
      {drawerEntityId && (
        <FollowUpForm
          open={followUpFormOpen}
          customerId={drawerEntityId}
          onClose={() => setFollowUpFormOpen(false)}
        />
      )}
    </>
  );
}
