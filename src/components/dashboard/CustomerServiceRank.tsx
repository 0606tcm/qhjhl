'use client';

import ReactECharts from 'echarts-for-react';
import { trpc } from '@/lib/trpc';
import { chartColors } from '@/lib/chartTheme';
import { Skeleton } from 'antd';
import { useStore } from '@/store';

export function CustomerServiceRank() {
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

  const sortedData = [...data.byCustomer].sort((a, b) => a.count - b.count);

  const option = {
    title: {
      text: '客户服务排名 Top 5',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#1C1917',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#fff',
      borderColor: '#E7E5E4',
      textStyle: { color: '#44403C' },
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: '次数',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#78716C' },
      splitLine: { lineStyle: { color: '#F5F5F4' } },
    },
    yAxis: {
      type: 'category',
      data: sortedData.map((d) => d.customerName),
      axisLine: { lineStyle: { color: '#D6D3D1' } },
      axisLabel: { color: '#44403C' },
    },
    series: [
      {
        name: '跟进次数',
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          color: chartColors[0],
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: 'right',
          color: '#57534E',
        },
        data: sortedData.map((d) => d.count),
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <ReactECharts option={option} style={{ height: 300 }} />
    </div>
  );
}
