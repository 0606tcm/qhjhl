import {
  products,
  customers,
  holdings,
  followUps,
  salespeople,
  type MockProduct,
} from './data';
import {
  PRODUCT_TYPE_MAP,
  PRODUCT_STATUS_MAP,
  FOLLOW_UP_TYPE_MAP,
  type ProductType,
  type FollowUpType,
  type AgentResponseData,
} from '@/types';

export type AgentToolCall = {
  name: string;
  args: Record<string, unknown>;
};

export type AgentReply = {
  content: string;
  data?: AgentResponseData;
  toolCalls?: AgentToolCall[];
};

const PRODUCT_TYPE_REGEX: Record<ProductType, RegExp> = {
  stock: /股票型?/,
  bond: /债券型?|纯债|信用债/,
  hybrid: /混合型?|平衡|灵活配置/,
  money: /货币型?|现金|活期/,
};

const PRODUCT_STATUS_REGEX: Record<string, RegExp> = {
  active: /运作中|在运作|已运作/,
  raising: /募集中|在募|新发/,
  liquidated: /清盘|已结束/,
};

const FOLLOW_UP_TYPE_REGEX: Record<FollowUpType, RegExp> = {
  call: /电话|通话|打给|致电/,
  visit: /拜访|上门|到访|登门/,
  meeting: /会议|见面|面谈|开会|会面/,
  other: /其他/,
};

function extractCustomerName(text: string): string | null {
  for (const c of customers) {
    if (text.includes(c.name)) return c.name;
  }
  return null;
}

function extractProductMatch(text: string): MockProduct | null {
  let best: MockProduct | null = null;
  for (const p of products) {
    if (text.includes(p.name) || text.includes(p.code)) {
      if (!best || p.name.length > best.name.length) best = p;
    }
  }
  return best;
}

function extractProductType(text: string): ProductType | undefined {
  for (const [type, re] of Object.entries(PRODUCT_TYPE_REGEX)) {
    if (re.test(text)) return type as ProductType;
  }
  return undefined;
}

function extractProductStatus(text: string): string | undefined {
  for (const [status, re] of Object.entries(PRODUCT_STATUS_REGEX)) {
    if (re.test(text)) return status;
  }
  return undefined;
}

function extractFollowUpType(text: string): FollowUpType {
  for (const [type, re] of Object.entries(FOLLOW_UP_TYPE_REGEX)) {
    if (re.test(text)) return type as FollowUpType;
  }
  return 'other';
}

function extractAmountHint(text: string): number | null {
  const m = text.match(/(\d+(?:\.\d+)?)\s*(万|亿)?/);
  if (!m) return null;
  const num = parseFloat(m[1]);
  return m[2] === '亿' ? num * 10000 : num;
}

// --- Tool implementations (run against in-memory mock store) ---

function toolQueryProducts(args: {
  type?: ProductType;
  status?: string;
  keyword?: string;
}): AgentResponseData {
  let list = [...products];
  if (args.type) list = list.filter((p) => p.type === args.type);
  if (args.status) list = list.filter((p) => p.status === args.status);
  if (args.keyword) list = list.filter((p) => p.name.includes(args.keyword!));
  list = list.sort((a, b) => b.aum - a.aum).slice(0, 10);

  const title = [
    '产品查询',
    args.type && PRODUCT_TYPE_MAP[args.type],
    args.status && PRODUCT_STATUS_MAP[args.status as keyof typeof PRODUCT_STATUS_MAP],
    args.keyword && `关键字「${args.keyword}」`,
  ]
    .filter(Boolean)
    .join(' · ');

  return {
    type: 'query_result',
    queryResult: {
      title,
      columns: [
        { key: 'code', title: '代码' },
        { key: 'name', title: '名称' },
        { key: 'typeName', title: '类型' },
        { key: 'nav', title: '最新净值' },
        { key: 'aum', title: '规模(亿)' },
        { key: 'statusName', title: '状态' },
      ],
      data: list.map((p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        typeName: PRODUCT_TYPE_MAP[p.type],
        nav: p.nav.toFixed(4),
        aum: p.aum.toFixed(2),
        statusName: PRODUCT_STATUS_MAP[p.status as keyof typeof PRODUCT_STATUS_MAP],
      })),
      actions: [
        { label: '查看全部产品', action: 'goto', params: { href: '/products' } },
      ],
    },
  };
}

function toolQueryCustomerHoldings(args: {
  customerName: string;
  productType?: ProductType;
}): AgentResponseData | null {
  const customer = customers.find((c) => c.name.includes(args.customerName));
  if (!customer) return null;
  let list = holdings
    .filter((h) => h.customerId === customer.id)
    .map((h) => ({ h, p: products.find((p) => p.id === h.productId)! }));
  if (args.productType) {
    list = list.filter((x) => x.p.type === args.productType);
  }
  list = list.sort((a, b) => b.h.amount - a.h.amount);

  return {
    type: 'query_result',
    queryResult: {
      title: `${customer.name} 的持仓${args.productType ? `（${PRODUCT_TYPE_MAP[args.productType]}）` : ''}`,
      columns: [
        { key: 'productName', title: '产品名称' },
        { key: 'productType', title: '类型' },
        { key: 'amount', title: '持仓(万)' },
        { key: 'nav', title: '最新净值' },
      ],
      data: list.map((x) => ({
        productName: x.p.name,
        productType: PRODUCT_TYPE_MAP[x.p.type],
        amount: x.h.amount.toFixed(2),
        nav: x.p.nav.toFixed(4),
      })),
      actions: [
        {
          label: `打开 ${customer.name} 的详情`,
          action: 'open_customer_drawer',
          params: { customerId: customer.id },
        },
      ],
    },
  };
}

function toolQueryProductHolders(args: { productName: string }): AgentResponseData | null {
  const product = products.find(
    (p) => p.name.includes(args.productName) || p.code === args.productName
  );
  if (!product) return null;
  const list = holdings
    .filter((h) => h.productId === product.id)
    .map((h) => ({ h, c: customers.find((c) => c.id === h.customerId)! }))
    .sort((a, b) => b.h.amount - a.h.amount);

  return {
    type: 'query_result',
    queryResult: {
      title: `${product.name} 的持有人`,
      columns: [
        { key: 'customerName', title: '客户' },
        { key: 'amount', title: '持仓(万)' },
        { key: 'purchaseDate', title: '买入日期' },
      ],
      data: list.map((x) => ({
        customerName: x.c.name,
        amount: x.h.amount.toFixed(2),
        purchaseDate: x.h.purchaseDate.toISOString().slice(0, 10),
      })),
      actions: [
        {
          label: '查看产品详情',
          action: 'open_product_drawer',
          params: { productId: product.id },
        },
      ],
    },
  };
}

function toolQueryStatistics(args: { metric: string }): AgentResponseData {
  const metric = args.metric;
  switch (metric) {
    case 'customer_count': {
      return {
        type: 'query_result',
        queryResult: {
          title: '客户总数',
          columns: [
            { key: 'label', title: '指标' },
            { key: 'value', title: '数值' },
          ],
          data: [{ label: '客户数量', value: `${customers.length} 位` }],
        },
      };
    }
    case 'product_count': {
      const active = products.filter((p) => p.status === 'active').length;
      return {
        type: 'query_result',
        queryResult: {
          title: '运作中产品',
          columns: [
            { key: 'label', title: '指标' },
            { key: 'value', title: '数值' },
          ],
          data: [{ label: '运作中产品', value: `${active} 只` }],
        },
      };
    }
    case 'total_aum': {
      const sum = products
        .filter((p) => p.status === 'active')
        .reduce((s, p) => s + p.aum, 0);
      return {
        type: 'query_result',
        queryResult: {
          title: 'AUM 总规模',
          columns: [
            { key: 'label', title: '指标' },
            { key: 'value', title: '数值' },
          ],
          data: [{ label: 'AUM 总规模', value: `${sum.toFixed(2)} 亿` }],
        },
      };
    }
    case 'follow_up_count': {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const count = followUps.filter((f) => f.createdAt >= startOfMonth).length;
      return {
        type: 'query_result',
        queryResult: {
          title: '本月跟进',
          columns: [
            { key: 'label', title: '指标' },
            { key: 'value', title: '数值' },
          ],
          data: [{ label: '本月跟进次数', value: `${count} 次` }],
        },
      };
    }
    default:
      return {
        type: 'text',
      };
  }
}

function toolRenderChart(args: { chart: string }): AgentResponseData | null {
  switch (args.chart) {
    case 'product_distribution': {
      const active = products.filter((p) => p.status === 'active');
      const map = new Map<string, number>();
      for (const p of active) map.set(p.type, (map.get(p.type) || 0) + p.aum);
      const data = Array.from(map.entries()).map(([type, aum]) => ({
        name: PRODUCT_TYPE_MAP[type as ProductType],
        value: Number(aum.toFixed(2)),
      }));
      return {
        type: 'chart',
        chartConfig: { type: 'pie', title: '运作中产品类型规模占比', data },
      };
    }
    case 'aum_trend': {
      const months = ['2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04'];
      const base = 10;
      const data = months.map((date, i) => ({
        name: date,
        value: Number((base + i * 0.5 + Math.random() * 0.4).toFixed(2)),
      }));
      return {
        type: 'chart',
        chartConfig: { type: 'line', title: 'AUM 近半年趋势', data },
      };
    }
    case 'team_ranking': {
      const sales = salespeople.filter((s) => s.role === 'sales');
      const data = sales
        .map((sp) => ({
          name: sp.name,
          value: customers
            .filter((c) => c.salespersonId === sp.id)
            .reduce((s, c) => s + c.totalAssets, 0),
        }))
        .sort((a, b) => b.value - a.value);
      return {
        type: 'chart',
        chartConfig: { type: 'bar', title: '团队 AUM 排行（万元）', data },
      };
    }
    default:
      return null;
  }
}

function toolParseFollowUp(args: { rawText: string }): AgentResponseData {
  const text = args.rawText;
  const type = extractFollowUpType(text);
  const customer = extractCustomerName(text);
  const product = extractProductMatch(text);
  const amount = extractAmountHint(text);

  return {
    type: 'form_data',
    formData: {
      formType: 'followUp',
      prefilled: {
        customerId: customer ? customers.find((c) => c.name === customer)?.id : undefined,
        customerName: customer,
        type,
        typeName: FOLLOW_UP_TYPE_MAP[type],
        content: text,
        relatedProductIds: product ? [product.id] : [],
        relatedProductNames: product ? [product.name] : [],
        amountHint: amount,
      },
    },
  };
}

// --- Intent routing: decide which tool(s) to invoke --------------

function routeIntent(rawText: string): AgentToolCall[] {
  const text = rawText.trim();

  // 图表意图
  if (/(占比|分布|规模占比)/.test(text) && /(产品|类型)/.test(text)) {
    return [{ name: 'render_chart', args: { chart: 'product_distribution' } }];
  }
  if (/(趋势|走势|近半年|近6个月)/.test(text) && /(aum|规模)/i.test(text)) {
    return [{ name: 'render_chart', args: { chart: 'aum_trend' } }];
  }
  if (/(排行|排名|榜)/.test(text) && /(团队|销售|aum)/i.test(text)) {
    return [{ name: 'render_chart', args: { chart: 'team_ranking' } }];
  }

  // 辅助录入意图
  if (/(记录|录入|新增|填一条|帮我记|帮我录|我想记)/.test(text) && /(跟进|沟通|拜访|电话|会议|见面|聊)/.test(text)) {
    return [{ name: 'parse_follow_up', args: { rawText: text } }];
  }
  if (/(电话|拜访|上门|会议|见面|聊了)/.test(text) && extractCustomerName(text)) {
    return [{ name: 'parse_follow_up', args: { rawText: text } }];
  }

  // 客户持仓意图
  const customerName = extractCustomerName(text);
  if (customerName && /(持有|买了|持仓|买的|投了)/.test(text)) {
    return [
      {
        name: 'query_customer_holdings',
        args: { customerName, productType: extractProductType(text) },
      },
    ];
  }

  // 产品持有人意图
  const productMatch = extractProductMatch(text);
  if (productMatch && /(谁|哪些客户|有哪些|哪些人|持有人)/.test(text)) {
    return [
      { name: 'query_product_holders', args: { productName: productMatch.name } },
    ];
  }

  // 统计意图
  if (/(aum|总规模|规模合计)/i.test(text)) {
    return [{ name: 'query_statistics', args: { metric: 'total_aum' } }];
  }
  if (/(客户数|多少客户|几位客户)/.test(text)) {
    return [{ name: 'query_statistics', args: { metric: 'customer_count' } }];
  }
  if (/(产品数|几只产品|多少产品)/.test(text)) {
    return [{ name: 'query_statistics', args: { metric: 'product_count' } }];
  }
  if (/(本月跟进|跟进次数|跟进多少)/.test(text)) {
    return [{ name: 'query_statistics', args: { metric: 'follow_up_count' } }];
  }

  // 产品查询意图
  const ptype = extractProductType(text);
  const pstatus = extractProductStatus(text);
  if ((ptype || pstatus) && /(产品|基金|列表)/.test(text)) {
    return [
      {
        name: 'query_products',
        args: { type: ptype, status: pstatus },
      },
    ];
  }

  return [];
}

function executeTool(call: AgentToolCall): AgentResponseData | null {
  switch (call.name) {
    case 'query_products':
      return toolQueryProducts(call.args as Parameters<typeof toolQueryProducts>[0]);
    case 'query_customer_holdings':
      return toolQueryCustomerHoldings(
        call.args as Parameters<typeof toolQueryCustomerHoldings>[0]
      );
    case 'query_product_holders':
      return toolQueryProductHolders(
        call.args as Parameters<typeof toolQueryProductHolders>[0]
      );
    case 'query_statistics':
      return toolQueryStatistics(call.args as { metric: string });
    case 'render_chart':
      return toolRenderChart(call.args as { chart: string });
    case 'parse_follow_up':
      return toolParseFollowUp(call.args as { rawText: string });
    default:
      return null;
  }
}

function summarize(data: AgentResponseData | null, call: AgentToolCall | null): string {
  if (!data) return '我没在系统里找到相关数据，请换个说法再试。';
  switch (data.type) {
    case 'query_result': {
      const rows = data.queryResult?.data.length ?? 0;
      const title = data.queryResult?.title ?? '查询结果';
      return rows === 0
        ? `「${title}」没有匹配的数据。`
        : `已为你查到 ${rows} 条结果，见下表。`;
    }
    case 'chart':
      return `已生成图表「${data.chartConfig?.title ?? ''}」。`;
    case 'form_data': {
      const name = (data.formData?.prefilled.customerName as string | undefined) ?? '该客户';
      const typeName = (data.formData?.prefilled.typeName as string | undefined) ?? '沟通';
      return `已解析出一条「${typeName}」跟进草稿，客户：${name}。可直接一键填入跟进表单。`;
    }
    default:
      return call ? '已处理你的请求。' : '';
  }
}

const HELP_TEXT = [
  '你好，我是 FundOS 助手。我可以帮你：',
  '  · 按类型/状态查产品，如「运作中的债券型产品有哪些」',
  '  · 查客户持仓，如「林总持有哪些股票型产品」',
  '  · 查产品持有人，如「价值精选一号 有哪些客户买了」',
  '  · 出图表，如「帮我生成按产品类型的规模占比饼图」',
  '  · 录入跟进，如「今天电话和李总聊了稳健增长一号，他打算下周认购 50 万」',
].join('\n');

export function runAgent(messages: { role: 'user' | 'assistant'; content: string }[]): AgentReply {
  const last = messages.filter((m) => m.role === 'user').at(-1)?.content ?? '';
  if (!last.trim()) {
    return { content: HELP_TEXT };
  }

  const calls = routeIntent(last);
  if (calls.length === 0) {
    if (/(帮助|你能做什么|怎么用|help)/i.test(last)) {
      return { content: HELP_TEXT };
    }
    return {
      content:
        '我没完全 get 到你的意图。可以试试：\n  · 「运作中的股票型产品」\n  · 「林总持有哪些基金」\n  · 「帮我生成产品类型占比饼图」\n  · 「电话回访了张总，沟通了稳健增长一号」',
    };
  }

  const call = calls[0];
  const data = executeTool(call);
  return {
    content: summarize(data, call),
    data: data ?? undefined,
    toolCalls: calls,
  };
}
