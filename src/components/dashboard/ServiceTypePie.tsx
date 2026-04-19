'use client';

import ReactECharts from 'echarts-for-react';
import { trpc } from '@/lib/trpc';
import { chartColors } from '@/lib/chartTheme';
import { Skeleton } from 'antd';
import { useStore } from '@/store';

export function ServiceTypePie() {
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
      text: '服务类型分布',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#1C1917',
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#E7E5E4',
      textStyle: { color: '#44403C' },
      formatter: '{b}: {c}次 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#57534E' },
    },
    series: [
      {
        name: '服务类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        data: data.byType.map((d, i) => ({
          value: d.count,
          name: d.typeName,
          itemStyle: { color: chartColors[i] },
        })),
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <ReactECharts option={option} style={{ height: 300 }} />
    </div>
  );
}
