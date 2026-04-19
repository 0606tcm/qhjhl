'use client';

import { useState } from 'react';
import { message } from 'antd';
import { Layout } from '@/components/layout';
import { ProductFilters, ProductTable, ProductDrawer } from '@/components/products';
import { trpc } from '@/lib/trpc';
import { exportToExcel, productExportColumns } from '@/lib/export';

export default function ProductsPage() {
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = trpc.product.list.useQuery({
    keyword: keyword || undefined,
    type: type as 'stock' | 'bond' | 'hybrid' | 'money' | undefined,
    status: status as 'raising' | 'active' | 'liquidated' | undefined,
    page,
    pageSize,
  });

  const handleClearFilters = () => {
    setKeyword('');
    setType(undefined);
    setStatus(undefined);
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
      code: item.code,
      name: item.name,
      type: item.type,
      nav: item.nav,
      navChange: item.navChange,
      aum: item.aum,
      status: item.status,
      manager: item.manager,
    }));
    exportToExcel(exportData, productExportColumns, `产品列表_${new Date().toLocaleDateString()}`);
    message.success('导出成功');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-warm-900">产品货架</h1>
        </div>

        {/* 筛选栏 */}
        <ProductFilters
          keyword={keyword}
          type={type}
          status={status}
          onKeywordChange={setKeyword}
          onTypeChange={setType}
          onStatusChange={setStatus}
          onClear={handleClearFilters}
          onExport={handleExport}
        />

        {/* 产品列表 */}
        <ProductTable
          data={data?.data ?? []}
          total={data?.total ?? 0}
          page={page}
          pageSize={pageSize}
          loading={isLoading}
          onPageChange={handlePageChange}
        />
      </div>

      {/* 产品详情侧边栏 */}
      <ProductDrawer />
    </Layout>
  );
}
