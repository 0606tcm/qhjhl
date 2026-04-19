'use client';

import ReactECharts from 'echarts-for-react';
import { trpc } from '@/lib/trpc';
import { chartColors } from '@/lib/chartTheme';
import { Skeleton } from 'antd';
import { useStore } from '@/store';

export function ServiceTrendChart() {
  const { currentUserId } = useStore();
  const { data, isLoading } = trpc.statistics.serviceStats.useQuery({
    salespersonId: currentUserId,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-5 h-[360px]">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!data) return null;

  const option = {
    title: {
      text: '服务次数趋势',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#1C1917',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#E7E5E4',
      textStyle: { color: '#44403C' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.trend.map((d) => d.date),
      axisLine: { lineStyle: { color: '#D6D3D1' } },
      axisLabel: { color: '#78716C' },
    },
    yAxis: {
      type: 'value',
      name: '次数',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#78716C' },
      splitLine: { lineStyle: { color: '#F5F5F4' } },
    },
    series: [
      {
        name: '跟进次数',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: chartColors[1],
          width: 2,
        },
        itemStyle: {
          color: chartColors[1],
        },
        data: data.trend.map((d) => d.count),
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <ReactECharts option={option} style={{ height: 300 }} />
    </div>
  );
}
