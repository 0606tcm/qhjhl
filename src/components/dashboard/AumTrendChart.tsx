'use client';

import ReactECharts from 'echarts-for-react';
import { trpc } from '@/lib/trpc';
import { chartColors } from '@/lib/chartTheme';
import { Skeleton } from 'antd';

export function AumTrendChart() {
  const { data, isLoading } = trpc.statistics.aumTrend.useQuery();

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
      text: 'AUM 规模趋势',
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
      formatter: (params: { name: string; value: number }[]) => {
        const p = params[0];
        return `${p.name}<br/>AUM: ${p.value.toFixed(2)}亿`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((d) => d.date),
      axisLine: { lineStyle: { color: '#D6D3D1' } },
      axisLabel: { color: '#78716C' },
    },
    yAxis: {
      type: 'value',
      name: '亿元',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#78716C' },
      splitLine: { lineStyle: { color: '#F5F5F4' } },
    },
    series: [
      {
        name: 'AUM',
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(217, 119, 6, 0.3)' },
              { offset: 1, color: 'rgba(217, 119, 6, 0.05)' },
            ],
          },
        },
        lineStyle: {
          color: chartColors[0],
          width: 2,
        },
        itemStyle: {
          color: chartColors[0],
        },
        data: data.map((d) => d.aum.toFixed(2)),
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <ReactECharts option={option} style={{ height: 300 }} />
    </div>
  );
}
