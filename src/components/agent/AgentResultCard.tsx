'use client';

import { Table, Button } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { chartColors } from '@/lib/chartTheme';
import type { AgentResponseData, FollowUpType } from '@/types';

interface AgentResultCardProps {
  data: AgentResponseData;
}

type ChartPoint = { name: string; value: number };

function QueryResultView({
  queryResult,
}: {
  queryResult: NonNullable<AgentResponseData['queryResult']>;
}) {
  const router = useRouter();
  const { openDrawer } = useStore();

  const columns = queryResult.columns.map((col) => ({
    key: col.key,
    title: col.title,
    dataIndex: col.key,
  }));

  const handleAction = (action: { action: string; params?: Record<string, unknown> }) => {
    switch (action.action) {
      case 'goto':
        if (typeof action.params?.href === 'string') router.push(action.params.href);
        break;
      case 'open_customer_drawer':
        if (typeof action.params?.customerId === 'string')
          openDrawer('customer', action.params.customerId);
        break;
      case 'open_product_drawer':
        if (typeof action.params?.productId === 'string')
          openDrawer('product', action.params.productId);
        break;
    }
  };

  return (
    <div className="mt-2 rounded-lg border border-warm-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-warm-100 bg-warm-50 text-xs font-semibold text-warm-700">
        {queryResult.title}
      </div>
      <Table
        size="small"
        rowKey={(row, index) =>
          (row as { id?: string }).id ?? (row as { code?: string }).code ?? String(index)
        }
        columns={columns}
        dataSource={queryResult.data}
        pagination={false}
        scroll={{ x: 'max-content', y: 220 }}
        locale={{ emptyText: '暂无数据' }}
      />
      {queryResult.actions && queryResult.actions.length > 0 && (
        <div className="px-3 py-2 border-t border-warm-100 flex items-center gap-2">
          {queryResult.actions.map((action) => (
            <Button
              key={action.label}
              size="small"
              type="link"
              onClick={() => handleAction(action)}
              className="text-gold-600 p-0 h-auto"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChartView({
  chartConfig,
}: {
  chartConfig: NonNullable<AgentResponseData['chartConfig']>;
}) {
  const data = (chartConfig.data as ChartPoint[]) || [];
  const baseTitle = {
    text: chartConfig.title,
    textStyle: { fontSize: 13, fontWeight: 600, color: '#1C1917' },
  };
  const baseTooltip = {
    backgroundColor: '#fff',
    borderColor: '#E7E5E4',
    textStyle: { color: '#44403C' },
  };

  let option;
  if (chartConfig.type === 'pie') {
    option = {
      title: baseTitle,
      tooltip: { ...baseTooltip, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', right: '3%', top: 'center', textStyle: { fontSize: 11 } },
      series: [
        {
          type: 'pie',
          radius: ['45%', '68%'],
          center: ['36%', '55%'],
          itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
          label: { show: false },
          data: data.map((d, i) => ({
            name: d.name,
            value: d.value,
            itemStyle: { color: chartColors[i % chartColors.length] },
          })),
        },
      ],
    };
  } else if (chartConfig.type === 'line') {
    option = {
      title: baseTitle,
      tooltip: { ...baseTooltip, trigger: 'axis' },
      grid: { top: 36, left: 40, right: 16, bottom: 28 },
      xAxis: { type: 'category', data: data.map((d) => d.name) },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'line',
          smooth: true,
          areaStyle: { opacity: 0.1 },
          itemStyle: { color: chartColors[0] },
          data: data.map((d) => d.value),
        },
      ],
    };
  } else {
    option = {
      title: baseTitle,
      tooltip: { ...baseTooltip, trigger: 'axis' },
      grid: { top: 36, left: 48, right: 16, bottom: 28 },
      xAxis: { type: 'category', data: data.map((d) => d.name) },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          itemStyle: { color: chartColors[1], borderRadius: [4, 4, 0, 0] },
          data: data.map((d) => d.value),
        },
      ],
    };
  }

  return (
    <div className="mt-2 rounded-lg border border-warm-200 bg-white p-2">
      <ReactECharts option={option} style={{ height: 240 }} />
    </div>
  );
}

function FormDataView({
  formData,
}: {
  formData: NonNullable<AgentResponseData['formData']>;
}) {
  const { setFollowUpDraft, openDrawer } = useStore();
  const prefilled = formData.prefilled as {
    customerId?: string;
    customerName?: string;
    type?: FollowUpType;
    typeName?: string;
    content?: string;
    relatedProductIds?: string[];
    relatedProductNames?: string[];
  };

  const canApply = Boolean(prefilled.customerId);

  const handleApply = () => {
    if (!prefilled.customerId) return;
    setFollowUpDraft({
      customerId: prefilled.customerId,
      type: prefilled.type,
      content: prefilled.content,
      relatedProductIds: prefilled.relatedProductIds,
    });
    openDrawer('customer', prefilled.customerId);
  };

  return (
    <div className="mt-2 rounded-lg border border-gold-200 bg-gold-50 p-3 text-xs text-warm-800 space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gold-700">跟进草稿已解析</span>
        <Button
          size="small"
          type="primary"
          disabled={!canApply}
          onClick={handleApply}
          className="bg-gold-600 hover:bg-gold-700"
        >
          一键填入
        </Button>
      </div>
      <div>客户：{prefilled.customerName || '未识别（请补充）'}</div>
      <div>方式：{prefilled.typeName || '—'}</div>
      {prefilled.relatedProductNames && prefilled.relatedProductNames.length > 0 && (
        <div>相关产品：{prefilled.relatedProductNames.join('、')}</div>
      )}
      <div className="whitespace-pre-wrap text-warm-700 pt-1">{prefilled.content}</div>
      {!canApply && (
        <div className="text-red-500 pt-1">未识别到客户，暂无法直接填入表单。</div>
      )}
    </div>
  );
}

export function AgentResultCard({ data }: AgentResultCardProps) {
  if (data.type === 'query_result' && data.queryResult) {
    return <QueryResultView queryResult={data.queryResult} />;
  }
  if (data.type === 'chart' && data.chartConfig) {
    return <ChartView chartConfig={data.chartConfig} />;
  }
  if (data.type === 'form_data' && data.formData) {
    return <FormDataView formData={data.formData} />;
  }
  return null;
}
