'use client';

import { Drawer, Descriptions, Table, Spin, Empty, Result, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useStore } from '@/store';
import { ProductTypeTag, ProductStatusTag, RiskPreferenceTag } from '@/components/common';
import { formatNav, formatChange, formatDate, formatAmount } from '@/lib/format';
import type { ProductType, ProductStatus, RiskPreference } from '@/types';

interface HolderRecord {
  id: string;
  amount: number;
  shares: number;
  customer: {
    id: string;
    name: string;
    phone: string;
    riskPreference: string;
  };
}

export function ProductDrawer() {
  const { drawerOpen, drawerType, drawerEntityId, closeDrawer, openDrawer } = useStore();
  const isOpen = drawerOpen && drawerType === 'product' && !!drawerEntityId;

  const { data, isLoading, isError, refetch } = trpc.product.byId.useQuery(
    { id: drawerEntityId ?? '' },
    { enabled: !!drawerEntityId && drawerType === 'product' }
  );

  const holderColumns: ColumnsType<HolderRecord> = [
    {
      title: '客户姓名',
      dataIndex: ['customer', 'name'],
      key: 'name',
      render: (name: string, record) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDrawer('customer', record.customer.id);
          }}
          className="text-navy-700 hover:text-gold-600 font-medium"
        >
          {name}
        </button>
      ),
    },
    {
      title: '风险偏好',
      dataIndex: ['customer', 'riskPreference'],
      key: 'riskPreference',
      render: (pref: RiskPreference) => <RiskPreferenceTag preference={pref} />,
    },
    {
      title: '持仓金额',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount: number) => <span className="font-mono">{formatAmount(amount)}</span>,
    },
    {
      title: '持有份额',
      dataIndex: 'shares',
      key: 'shares',
      align: 'right',
      render: (shares: number) => <span className="font-mono">{shares.toLocaleString()}</span>,
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">产品详情</span>
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
      ) : isError ? (
        <Result
          status="error"
          title="加载失败"
          subTitle="请稍后再试"
          extra={
            <Button type="primary" onClick={() => refetch()} className="bg-gold-600">
              重试
            </Button>
          }
        />
      ) : data ? (
        <div className="space-y-6">
          {/* 产品名称和类型 */}
          <div>
            <h2 className="text-xl font-semibold text-warm-900 mb-2">{data.name}</h2>
            <div className="flex items-center gap-2">
              <ProductTypeTag type={data.type as ProductType} />
              <ProductStatusTag status={data.status as ProductStatus} />
              <span className="text-warm-500 text-sm">代码: {data.code}</span>
            </div>
          </div>

          {/* 基本信息 */}
          <div className="bg-warm-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-warm-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-gold-600 rounded"></span>
              基本信息
            </h3>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="最新净值">
                <span className="font-mono font-medium">{formatNav(data.nav)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="日涨跌">
                <span
                  className={`font-mono font-medium ${data.navChange >= 0 ? 'text-red-600' : 'text-green-600'}`}
                >
                  {formatChange(data.navChange)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="规模">
                <span className="font-mono">{data.aum.toFixed(2)}亿</span>
              </Descriptions.Item>
              <Descriptions.Item label="净值日期">{formatDate(data.navDate)}</Descriptions.Item>
              <Descriptions.Item label="基金经理">{data.manager}</Descriptions.Item>
              <Descriptions.Item label="成立日期">
                {formatDate(data.establishDate)}
              </Descriptions.Item>
            </Descriptions>
            {data.description && (
              <p className="text-sm text-warm-600 mt-3 leading-relaxed">{data.description}</p>
            )}
          </div>

          {/* 持有客户 */}
          <div>
            <h3 className="text-sm font-semibold text-warm-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-gold-600 rounded"></span>
              持有客户 ({data.holdings?.length || 0})
            </h3>
            {data.holdings && data.holdings.length > 0 ? (
              <Table
                columns={holderColumns}
                dataSource={data.holdings}
                rowKey="id"
                size="small"
                pagination={false}
              />
            ) : (
              <Empty description="暂无持有客户" />
            )}
          </div>
        </div>
      ) : (
        <Empty description="产品不存在" />
      )}
    </Drawer>
  );
}
