'use client';

import { Tag } from 'antd';
import type { ProductStatus, ProductType, RiskPreference, FollowUpType } from '@/types';

// 产品状态标签
const STATUS_CONFIG: Record<ProductStatus, { color: string; text: string }> = {
  raising: { color: '#FEF3C7', text: '募集中' },
  active: { color: '#DCFCE7', text: '运作中' },
  liquidated: { color: '#F5F5F4', text: '已清盘' },
};

const STATUS_TEXT_COLOR: Record<ProductStatus, string> = {
  raising: '#B45309',
  active: '#15803D',
  liquidated: '#78716C',
};

export function ProductStatusTag({ status }: { status: ProductStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Tag
      style={{
        backgroundColor: config.color,
        color: STATUS_TEXT_COLOR[status],
        border: 'none',
      }}
    >
      {config.text}
    </Tag>
  );
}

// 产品类型标签
const TYPE_CONFIG: Record<ProductType, { color: string; textColor: string; text: string }> = {
  stock: { color: '#FEF3C7', textColor: '#B45309', text: '股票型' },
  bond: { color: '#DBEAFE', textColor: '#1E4976', text: '债券型' },
  hybrid: { color: '#DCFCE7', textColor: '#15803D', text: '混合型' },
  money: { color: '#F3E8FF', textColor: '#7C3AED', text: '货币型' },
};

export function ProductTypeTag({ type }: { type: ProductType }) {
  const config = TYPE_CONFIG[type];
  return (
    <Tag style={{ backgroundColor: config.color, color: config.textColor, border: 'none' }}>
      {config.text}
    </Tag>
  );
}

// 风险偏好标签
const RISK_PREF_CONFIG: Record<RiskPreference, { color: string; textColor: string; text: string }> =
  {
    conservative: { color: '#DCFCE7', textColor: '#15803D', text: '保守型' },
    stable: { color: '#DBEAFE', textColor: '#1E4976', text: '稳健型' },
    aggressive: { color: '#FEE2E2', textColor: '#DC2626', text: '积极型' },
  };

export function RiskPreferenceTag({ preference }: { preference: RiskPreference }) {
  const config = RISK_PREF_CONFIG[preference];
  return (
    <Tag style={{ backgroundColor: config.color, color: config.textColor, border: 'none' }}>
      {config.text}
    </Tag>
  );
}

// 跟进类型标签
const FOLLOW_UP_CONFIG: Record<FollowUpType, { text: string }> = {
  call: { text: '电话' },
  visit: { text: '拜访' },
  meeting: { text: '会议' },
  other: { text: '其他' },
};

export function FollowUpTypeTag({ type }: { type: FollowUpType }) {
  const config = FOLLOW_UP_CONFIG[type];
  return (
    <Tag style={{ backgroundColor: '#F5F5F4', color: '#57534E', border: 'none' }}>
      {config.text}
    </Tag>
  );
}
