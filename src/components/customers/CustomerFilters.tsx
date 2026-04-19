'use client';

import { Input, Select, Button } from 'antd';
import { Search, X, Plus, Download } from 'lucide-react';

interface CustomerFiltersProps {
  keyword: string;
  riskPreference: string | undefined;
  onKeywordChange: (value: string) => void;
  onRiskPreferenceChange: (value: string | undefined) => void;
  onClear: () => void;
  onAddCustomer: () => void;
  onExport: () => void;
}

const riskOptions = [
  { value: 'conservative', label: '保守型' },
  { value: 'stable', label: '稳健型' },
  { value: 'aggressive', label: '积极型' },
];

export function CustomerFilters({
  keyword,
  riskPreference,
  onKeywordChange,
  onRiskPreferenceChange,
  onClear,
  onAddCustomer,
  onExport,
}: CustomerFiltersProps) {
  const hasFilters = keyword || riskPreference;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <Input
          placeholder="搜索客户姓名..."
          prefix={<Search className="w-4 h-4 text-warm-400" />}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="w-64"
          allowClear
        />
        <Select
          placeholder="风险偏好"
          options={riskOptions}
          value={riskPreference}
          onChange={onRiskPreferenceChange}
          allowClear
          className="w-32"
        />
        {hasFilters && (
          <Button type="link" onClick={onClear} icon={<X className="w-4 h-4" />}>
            清除筛选
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          icon={<Download className="w-4 h-4" />}
          onClick={onExport}
        >
          导出Excel
        </Button>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={onAddCustomer}
          className="bg-gold-600 hover:bg-gold-700"
        >
          新增客户
        </Button>
      </div>
    </div>
  );
}
