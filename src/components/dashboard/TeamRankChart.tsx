'use client';

import ReactECharts from 'echarts-for-react';
import { trpc } from '@/lib/trpc';
import { chartColors } from '@/lib/chartTheme';
import { Skeleton, Tabs } from 'antd';

type MetricType = 'aum' | 'score';

export function TeamRankChart() {
  const { data, isLoading } = trpc.statistics.teamRanking.useQuery();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-5 h-[360px]">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!data) return null;

  const getOption = (metric: MetricType) => {
    const sortedData = [...data].sort((a, b) => {
      if (metric === 'aum') return a.aum - b.aum;
      return a.score - b.score;
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#fff',
        borderColor: '#E7E5E4',
        textStyle: { color: '#44403C' },
        formatter: (params: { name: string; value: number }[]) => {
          const p = params[0];
          if (metric === 'aum') {
            return `${p.name}<br/>AUM: ${p.value.toFixed(2)}亿`;
          }
          return `${p.name}<br/>综合评分: ${p.value}分`;
        },
      },
      grid: {
        left: '3%',
        right: '12%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: metric === 'aum' ? '亿元' : '分',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#78716C' },
        splitLine: { lineStyle: { color: '#F5F5F4' } },
      },
      yAxis: {
        type: 'category',
        data: sortedData.map((d) => d.salespersonName),
        axisLine: { lineStyle: { color: '#D6D3D1' } },
        axisLabel: { color: '#44403C' },
      },
      series: [
        {
          name: metric === 'aum' ? 'AUM' : '综合评分',
          type: 'bar',
          barWidth: 20,
          itemStyle: {
            color: metric === 'aum' ? chartColors[0] : chartColors[1],
            borderRadius: [0, 4, 4, 0],
          },
          label: {
            show: true,
            position: 'right',
            color: '#57534E',
            formatter: (params: { value: number }) =>
              metric === 'aum' ? params.value.toFixed(2) : params.value,
          },
          data: sortedData.map((d) => (metric === 'aum' ? d.aum : d.score)),
        },
      ],
    };
  };

  const items = [
    {
      key: 'aum',
      label: '团队 AUM 排行',
      children: <ReactECharts option={getOption('aum')} style={{ height: 280 }} />,
    },
    {
      key: 'score',
      label: '综合评分排行',
      children: <ReactECharts option={getOption('score')} style={{ height: 280 }} />,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <Tabs items={items} />
    </div>
  );
}
