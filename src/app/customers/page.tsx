'use client';

import { useState } from 'react';
import { message } from 'antd';
import { Layout } from '@/components/layout';
import {
  CustomerFilters,
  CustomerTable,
  CustomerForm,
  CustomerDrawer,
} from '@/components/customers';
import { trpc } from '@/lib/trpc';
import { useStore } from '@/store';
import { exportToExcel, customerExportColumns } from '@/lib/export';

export default function CustomersPage() {
  const { currentUserId, viewMode } = useStore();
  const [keyword, setKeyword] = useState('');
  const [riskPreference, setRiskPreference] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);

  const { data, isLoading } = trpc.customer.list.useQuery({
    keyword: keyword || undefined,
    riskPreference: riskPreference as 'conservative' | 'stable' | 'aggressive' | undefined,
    salespersonId: viewMode === 'sales' ? currentUserId : undefined,
    page,
    pageSize,
  });

  const handleClearFilters = () => {
    setKeyword('');
    setRiskPreference(undefined);
    setPage(1);
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleExport = () => {
    if (!data?.data || data.data.length === 0) {
      message.warning('暂无数据可导出');
      return;
    }
    const exportData = data.data.map((item) => ({
      name: item.name,
      phone: item.phone,
      riskPreference: item.riskPreference,
      totalAssets: item.totalAssets,
      email: item.email || '',
    }));
    exportToExcel(exportData, customerExportColumns, `客户列表_${new Date().toLocaleDateString()}`);
    message.success('导出成功');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-warm-900">客户管理</h1>
        </div>

        {/* 筛选栏 */}
        <CustomerFilters
          keyword={keyword}
          riskPreference={riskPreference}
          onKeywordChange={setKeyword}
          onRiskPreferenceChange={setRiskPreference}
          onClear={handleClearFilters}
          onAddCustomer={() => setCustomerFormOpen(true)}
          onExport={handleExport}
        />

        {/* 客户列表 */}
        <CustomerTable
          data={data?.data ?? []}
          total={data?.total ?? 0}
          page={page}
          pageSize={pageSize}
          loading={isLoading}
          onPageChange={handlePageChange}
        />
      </div>

      {/* 新增客户表单 */}
      <CustomerForm open={customerFormOpen} onClose={() => setCustomerFormOpen(false)} />

      {/* 客户详情侧边栏 */}
      <CustomerDrawer />
    </Layout>
  );
}
