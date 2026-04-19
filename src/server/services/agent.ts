import OpenAI from 'openai';
import { prisma } from '../db/client';
import {
  PRODUCT_TYPE_MAP,
  FOLLOW_UP_TYPE_MAP,
  type ProductType,
  type FollowUpType,
} from '@/types';

// DeepSeek API 配置
const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
});

// 定义工具
const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'query_products',
      description: '查询基金产品列表，支持按类型、状态、名称筛选',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['stock', 'bond', 'hybrid', 'money'],
            description: '产品类型',
          },
          status: {
            type: 'string',
            enum: ['raising', 'active', 'liquidated'],
            description: '产品状态',
          },
          keyword: { type: 'string', description: '搜索关键词' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'query_customer_holdings',
      description: '查询指定客户持有的产品列表',
      parameters: {
        type: 'object',
        properties: {
          customerName: { type: 'string', description: '客户姓名' },
          productType: {
            type: 'string',
            enum: ['stock', 'bond', 'hybrid', 'money'],
            description: '产品类型（可选）',
          },
        },
        required: ['customerName'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'query_product_holders',
      description: '查询持有指定产品的客户列表',
      parameters: {
        type: 'object',
        properties: {
          productName: { type: 'string', description: '产品名称' },
        },
        required: ['productName'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'query_statistics',
      description: '查询统计数据，如客户数量、产品数量、AUM总额等',
      parameters: {
        type: 'object',
        properties: {
          metric: {
            type: 'string',
            enum: ['customer_count', 'product_count', 'total_aum', 'follow_up_count'],
            description: '查询的统计指标',
          },
        },
        required: ['metric'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'parse_follow_up',
      description: '解析自然语言描述的跟进内容，提取结构化数据用于录入',
      parameters: {
        type: 'object',
        properties: {
          rawText: { type: 'string', description: '跟进内容的自然语言描述' },
        },
        required: ['rawText'],
      },
    },
  },
];

// 执行工具调用
async function executeToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case 'query_products': {
      const where: { type?: string; status?: string; name?: { contains: string } } = {};
      if (args.type) where.type = args.type as string;
      if (args.status) where.status = args.status as string;
      if (args.keyword) where.name = { contains: args.keyword as string };

      const products = await prisma.product.findMany({
        where,
        take: 10,
        orderBy: { aum: 'desc' },
      });
      return products.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        type: PRODUCT_TYPE_MAP[p.type as ProductType],
        nav: p.nav.toFixed(4),
        aum: `${p.aum.toFixed(2)}亿`,
        status: p.status,
      }));
    }

    case 'query_customer_holdings': {
      const customer = await prisma.customer.findFirst({
        where: { name: { contains: args.customerName as string } },
        include: {
          holdings: {
            include: { product: true },
            orderBy: { amount: 'desc' },
          },
        },
      });
      if (!customer) {
        return { error: `未找到客户: ${args.customerName}` };
      }
      let holdings = customer.holdings;
      if (args.productType) {
        holdings = holdings.filter((h) => h.product.type === args.productType);
      }
      return {
        customerId: customer.id,
        customerName: customer.name,
        holdings: holdings.map((h) => ({
          productId: h.product.id,
          productName: h.product.name,
          productType: PRODUCT_TYPE_MAP[h.product.type as ProductType],
          amount: `¥${h.amount.toFixed(2)}万`,
          nav: h.product.nav.toFixed(4),
        })),
      };
    }

    case 'query_product_holders': {
      const product = await prisma.product.findFirst({
        where: { name: { contains: args.productName as string } },
        include: {
          holdings: {
            include: { customer: true },
            orderBy: { amount: 'desc' },
          },
        },
      });
      if (!product) {
        return { error: `未找到产品: ${args.productName}` };
      }
      return {
        productId: product.id,
        productName: product.name,
        holders: product.holdings.map((h) => ({
          customerId: h.customer.id,
          customerName: h.customer.name,
          amount: `¥${h.amount.toFixed(2)}万`,
        })),
      };
    }

    case 'query_statistics': {
      const metric = args.metric as string;
      switch (metric) {
        case 'customer_count': {
          const count = await prisma.customer.count();
          return { metric: '客户数量', value: count, unit: '位' };
        }
        case 'product_count': {
          const count = await prisma.product.count({ where: { status: 'active' } });
          return { metric: '运作中产品数量', value: count, unit: '只' };
        }
        case 'total_aum': {
          const result = await prisma.product.aggregate({
            where: { status: 'active' },
            _sum: { aum: true },
          });
          return { metric: 'AUM总规模', value: result._sum.aum?.toFixed(2), unit: '亿' };
        }
        case 'follow_up_count': {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const count = await prisma.followUp.count({
            where: { createdAt: { gte: startOfMonth } },
          });
          return { metric: '本月跟进次数', value: count, unit: '次' };
        }
        default:
          return { error: '不支持的统计指标' };
      }
    }

    case 'parse_follow_up': {
      const rawText = args.rawText as string;
      // 简单的解析逻辑
      let type: FollowUpType = 'other';
      if (rawText.includes('电话')) type = 'call';
      else if (rawText.includes('拜访') || rawText.includes('上门')) type = 'visit';
      else if (rawText.includes('会议') || rawText.includes('见面')) type = 'meeting';

      return {
        type,
        typeName: FOLLOW_UP_TYPE_MAP[type],
        content: rawText,
        suggestion: '建议填写的跟进内容已解析完成，请确认后录入',
      };
    }

    default:
      return { error: `未知工具: ${name}` };
  }
}

// 系统提示词
const systemPrompt = `你是 FundOS 基金销售管理系统的 AI 助手。你可以帮助销售人员：

1. **查询数据**：查询产品信息、客户持仓、统计数据等
2. **辅助录入**：解析自然语言描述的跟进记录，提取结构化数据

## 可用数据
- 产品类型：股票型(stock)、债券型(bond)、混合型(hybrid)、货币型(money)
- 产品状态：募集中(raising)、运作中(active)、已清盘(liquidated)
- 客户风险偏好：保守型(conservative)、稳健型(stable)、积极型(aggressive)
- 跟进方式：电话(call)、拜访(visit)、会议(meeting)、其他(other)

## 回复规范
- 使用简洁专业的语言
- 金额使用中文单位（万、亿）
- 查询结果以清晰的格式呈现
- 如果用户意图不明确，主动询问澄清`;

// 主聊天函数
export async function chat(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<{ content: string; data?: unknown }> {
  // 检查 API Key
  if (!process.env.DEEPSEEK_API_KEY) {
    return {
      content: 'AI 助手暂不可用（未配置 API Key）。请在 .env 文件中设置 DEEPSEEK_API_KEY。',
    };
  }

  try {
    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: chatMessages,
      tools,
      tool_choice: 'auto',
    });

    const message = response.choices[0]?.message;
    if (!message) {
      return { content: '抱歉，AI 助手暂时无法响应，请稍后重试。' };
    }

    // 处理工具调用
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolResults: { name: string; result: unknown }[] = [];

      for (const toolCall of message.tool_calls) {
        if (toolCall.type === 'function') {
          const result = await executeToolCall(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments)
          );
          toolResults.push({ name: toolCall.function.name, result });
        }
      }

      // 将工具结果发送回模型获取最终回复
      const toolMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        ...chatMessages,
        message as OpenAI.Chat.ChatCompletionAssistantMessageParam,
        ...message.tool_calls
          .filter((tc): tc is OpenAI.Chat.ChatCompletionMessageToolCall & { type: 'function' } => tc.type === 'function')
          .map((tc, i) => ({
            role: 'tool' as const,
            tool_call_id: tc.id,
            content: JSON.stringify(toolResults[i]?.result),
          })),
      ];

      const finalResponse = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages: toolMessages,
      });

      const finalMessage = finalResponse.choices[0]?.message;
      return {
        content: finalMessage?.content || '查询完成',
        data: toolResults,
      };
    }

    return { content: message.content || '' };
  } catch (error) {
    console.error('Agent error:', error);
    return {
      content: '抱歉，AI 助手遇到了问题，请稍后重试。',
    };
  }
}
