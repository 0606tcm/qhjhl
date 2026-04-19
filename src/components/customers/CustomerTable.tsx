'use client';

import { Table, Badge, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { MessageCircle } from 'lucide-react';
import { RiskPreferenceTag } from '@/components/common';
import { formatAmount, formatDate, maskPhone } from '@/lib/format';
import { useStore } from '@/store';
import type { RiskPreference } from '@/types';

interface CustomerTag {
  tag: {
    id: string;
    name: string;
    color: string;
  };
}

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  riskPreference: string;
  totalAssets: number;
  createdAt: string | Date;
  salesperson: {
    id: string;
    name: string;
  };
  tags: CustomerTag[];
  _count: {
    holdings: number;
    followUps: number;
  };
}

interface CustomerTableProps {
  data: CustomerRecord[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number, pageSize: number) => void;
}

export function CustomerTable({
  data,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
}: CustomerTableProps) {
  const { openDrawer } = useStore();

  const columns: ColumnsType<CustomerRecord> = [
    {
      title: '客户姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (name: string, record) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDrawer('customer', record.id);
          }}
          className="text-left text-navy-700 hover:text-gold-600 font-medium"
        >
          {name}
        </button>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 180,
      render: (tags: CustomerTag[]) => (
        <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
          {tags?.slice(0, 3).map(({ tag }) => (
            <Tag key={tag.id} color={tag.color} className="m-0">
              {tag.name}
            </Tag>
          ))}
          {tags?.length > 3 && (
            <Tag className="m-0">+{tags.length - 3}</Tag>
          )}
        </div>
      ),
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      render: (phone: string) => <span className="font-mono text-warm-600">{maskPhone(phone)}</span>,
    },
    {
      title: '风险偏好',
      dataIndex: 'riskPreference',
      key: 'riskPreference',
      width: 100,
      render: (pref: RiskPreference) => <RiskPreferenceTag preference={pref} />,
    },
    {
      title: '总持仓',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      width: 120,
      align: 'right',
      render: (amount: number) => <span className="font-mono">{formatAmount(amount)}</span>,
    },
    {
      title: '持有产品',
      dataIndex: ['_count', 'holdings'],
      key: 'holdings',
      width: 100,
      align: 'center',
      render: (count: number) => <span>{count}只</span>,
    },
    {
      title: '跟进记录',
      dataIndex: ['_count', 'followUps'],
      key: 'followUps',
      width: 100,
      align: 'center',
      render: (count: number) => (
        <div className="flex items-center justify-center gap-1">
          {count > 0 ? (
            <Badge count={count} color="#D97706" size="small">
              <MessageCircle className="w-4 h-4 text-gold-600" />
            </Badge>
          ) : (
            <span className="text-warm-400">0条</span>
          )}
        </div>
      ),
    },
    {
      title: '客户经理',
      dataIndex: ['salesperson', 'name'],
      key: 'salesperson',
      width: 100,
    },
    {
      title: '入档时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string | Date) => (
        <span className="text-warm-500">{formatDate(date)}</span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: onPageChange,
        }}
        rowClassName="hover:bg-gold-50 cursor-pointer"
        onRow={(record) => ({
          onClick: () => openDrawer('customer', record.id),
        })}
      />
    </div>
  );
}
