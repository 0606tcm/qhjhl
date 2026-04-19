'use client';

import { Select } from 'antd';
import { useStore } from '@/store';

export function ViewSwitcher() {
  const { viewMode, setViewMode, currentUserName } = useStore();

  return (
    <div className="flex items-center gap-3">
      <Select
        value={viewMode}
        onChange={setViewMode}
        options={[
          { value: 'sales', label: '销售视角' },
          { value: 'leader', label: '团队长视角' },
        ]}
        className="w-28"
        size="small"
      />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center">
          <span className="text-gold-700 font-medium text-sm">
            {currentUserName.slice(0, 1)}
          </span>
        </div>
        <span className="text-sm text-warm-700">{currentUserName}</span>
      </div>
    </div>
  );
}
