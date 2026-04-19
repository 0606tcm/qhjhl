'use client';

import { Empty } from 'antd';
import { ProductTypeTag } from '@/components/common';
import { formatAmount, formatNav } from '@/lib/format';
import { useStore } from '@/store';
import type { ProductType } from '@/types';

interface HoldingRecord {
  id: string;
  amount: number;
  shares: number;
  cost: number;
  product: {
    id: string;
    code: string;
    name: string;
    type: string;
    nav: number;
  };
}

interface HoldingsListProps {
  holdings: HoldingRecord[];
}

export function HoldingsList({ holdings }: HoldingsListProps) {
  const { openDrawer } = useStore();

  if (holdings.length === 0) {
    return <Empty description="暂无持仓产品" />;
  }

  return (
    <div className="space-y-3">
      {holdings.map((holding) => {
        const profit = (holding.product.nav - holding.cost) * holding.shares;
        const profitRate = ((holding.product.nav - holding.cost) / holding.cost) * 100;
        const isProfit = profit >= 0;

        return (
          <div
            key={holding.id}
            className="p-3 bg-warm-50 rounded-lg hover:bg-gold-50 cursor-pointer transition-colors"
            onClick={() => openDrawer('product', holding.product.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-medium text-warm-900">{holding.product.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <ProductTypeTag type={holding.product.type as ProductType} />
                  <span className="text-xs text-warm-500">{holding.product.code}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-medium">{formatAmount(holding.amount)}</div>
                <div
                  className={`text-xs font-mono ${isProfit ? 'text-red-600' : 'text-green-600'}`}
                >
                  {isProfit ? '+' : ''}
                  {profitRate.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-warm-500">
              <div>
                <span className="text-warm-400">持有份额</span>
                <div className="font-mono">{holding.shares.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-warm-400">成本价</span>
                <div className="font-mono">{formatNav(holding.cost)}</div>
              </div>
              <div>
                <span className="text-warm-400">最新净值</span>
                <div className="font-mono">{formatNav(holding.product.nav)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
