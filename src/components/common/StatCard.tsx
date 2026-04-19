'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  prefix,
  suffix,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-5 border-l-[3px] border-gold-600">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-warm-500 mb-2">{title}</p>
          <p className="text-2xl font-semibold text-warm-900 font-mono">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-red-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-green-600" />
              )}
              <span
                className={`text-sm font-medium ${isPositive ? 'text-red-600' : 'text-green-600'}`}
              >
                {isPositive ? '+' : ''}
                {change}%
              </span>
              {changeLabel && <span className="text-xs text-warm-400 ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && <div className="text-gold-500">{icon}</div>}
      </div>
    </div>
  );
}
