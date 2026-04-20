'use client';

import { Table, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ProductTypeTag, ProductStatusTag } from '@/components/common';
import { formatNav, formatChange, formatDate } from '@/lib/format';
import { useStore } from '@/store';
import type { ProductType, ProductStatus } from '@/types';

interface ProductRecord {
  id: string;
  code: string;
  name: string;
  type: string;
  nav: number;
  navDate: string | Date;
  navChange: number;
  aum: number;
  status: string;
  riskLevel: string;
  manager: string;
}

interface ProductTableProps {
  data: ProductRecord[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number, pageSize: number) => void;
}

export function ProductTable({
  data,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
}: ProductTableProps) {
  const { openDrawer } = useStore();

  const columns: ColumnsType<ProductRecord> = [
    {
      title: '产品代码',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code: string) => <span className="font-mono text-warm-600">{code}</span>,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record) => (
        <button
          onClick={() => openDrawer('product', record.id)}
          className="text-left text-navy-700 hover:text-gold-600 font-medium"
        >
          {name}
        </button>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: ProductType) => <ProductTypeTag type={type} />,
    },
    {
      title: '最新净值',
      dataIndex: 'nav',
      key: 'nav',
      width: 100,
      align: 'right',
      render: (nav: number) => <span className="font-mono">{formatNav(nav)}</span>,
    },
    {
      title: '日涨跌',
      dataIndex: 'navChange',
      key: 'navChange',
      width: 100,
      align: 'right',
      render: (change: number) => (
        <span className={`font-mono ${change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
          {formatChange(change)}
        </span>
      ),
    },
    {
      title: '规模(亿)',
      dataIndex: 'aum',
      key: 'aum',
      width: 100,
      align: 'right',
      render: (aum: number) => <span className="font-mono">{aum.toFixed(2)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ProductStatus) => <ProductStatusTag status={status} />,
    },
    {
      title: '基金经理',
      dataIndex: 'manager',
      key: 'manager',
      width: 100,
    },
    {
      title: '净值日期',
      dataIndex: 'navDate',
      key: 'navDate',
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
          onClick: () => openDrawer('product', record.id),
        })}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="没有匹配的产品，试着调整筛选条件"
            />
          ),
        }}
      />
    </div>
  );
}
