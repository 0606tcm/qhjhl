'use client';

import { Input, Select, Button } from 'antd';
import { Search, X, Download } from 'lucide-react';

interface ProductFiltersProps {
  keyword: string;
  type: string | undefined;
  status: string | undefined;
  onKeywordChange: (value: string) => void;
  onTypeChange: (value: string | undefined) => void;
  onStatusChange: (value: string | undefined) => void;
  onClear: () => void;
  onExport: () => void;
}

const typeOptions = [
  { value: 'stock', label: '股票型' },
  { value: 'bond', label: '债券型' },
  { value: 'hybrid', label: '混合型' },
  { value: 'money', label: '货币型' },
];

const statusOptions = [
  { value: 'raising', label: '募集中' },
  { value: 'active', label: '运作中' },
  { value: 'liquidated', label: '已清盘' },
];

export function ProductFilters({
  keyword,
  type,
  status,
  onKeywordChange,
  onTypeChange,
  onStatusChange,
  onClear,
  onExport,
}: ProductFiltersProps) {
  const hasFilters = keyword || type || status;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <Input
          placeholder="搜索产品名称..."
          prefix={<Search className="w-4 h-4 text-warm-400" />}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="w-64"
          allowClear
        />
        <Select
          placeholder="产品类型"
          options={typeOptions}
          value={type}
          onChange={onTypeChange}
          allowClear
          className="w-32"
        />
        <Select
          placeholder="产品状态"
          options={statusOptions}
          value={status}
          onChange={onStatusChange}
          allowClear
          className="w-32"
        />
        {hasFilters && (
          <Button type="link" onClick={onClear} icon={<X className="w-4 h-4" />}>
            清除筛选
          </Button>
        )}
      </div>
      <Button
        icon={<Download className="w-4 h-4" />}
        onClick={onExport}
      >
        导出Excel
      </Button>
    </div>
  );
}
