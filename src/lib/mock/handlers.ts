import {
  salespeople,
  products,
  customers,
  holdings,
  followUps,
  tags,
  customerTags,
  nextId,
  type MockCustomer,
  type MockFollowUp,
  type MockTag,
  type MockCustomerTag,
} from './data';
import { PRODUCT_TYPE_MAP, FOLLOW_UP_TYPE_MAP } from '@/types';
import type { ProductType, FollowUpType } from '@/types';

type AnyInput = Record<string, unknown> | undefined;

const paginate = <T>(list: T[], page = 1, pageSize = 10) =>
  list.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

const byIdAsc = (a: { createdAt: Date }, b: { createdAt: Date }) =>
  a.createdAt.getTime() - b.createdAt.getTime();

const byCreatedDesc = (a: { createdAt: Date }, b: { createdAt: Date }) =>
  b.createdAt.getTime() - a.createdAt.getTime();

function expandCustomer(c: MockCustomer) {
  const sp = salespeople.find((s) => s.id === c.salespersonId);
  const cts = customerTags
    .filter((ct) => ct.customerId === c.id)
    .map((ct) => ({ ...ct, tag: tags.find((t) => t.id === ct.tagId)! }));
  const holdingsCount = holdings.filter((h) => h.customerId === c.id).length;
  const followUpsCount = followUps.filter((f) => f.customerId === c.id).length;
  return {
    ...c,
    salesperson: sp ? { id: sp.id, name: sp.name } : null,
    tags: cts,
    _count: { holdings: holdingsCount, followUps: followUpsCount },
  };
}

export const mockHandlers: Record<string, (input: AnyInput) => unknown | Promise<unknown>> = {
  // -------- product --------
  'product.list': (input) => {
    const { type, status, keyword, page = 1, pageSize = 10 } = (input || {}) as {
      type?: string;
      status?: string;
      keyword?: string;
      page?: number;
      pageSize?: number;
    };
    let list = [...products];
    if (type) list = list.filter((p) => p.type === type);
    if (status) list = list.filter((p) => p.status === status);
    if (keyword) list = list.filter((p) => p.name.includes(keyword));
    list.sort((a, b) => b.aum - a.aum);
    return {
      data: paginate(list, page, pageSize),
      total: list.length,
      page,
      pageSize,
    };
  },

  'product.byId': (input) => {
    const { id } = (input || {}) as { id: string };
    const product = products.find((p) => p.id === id);
    if (!product) return null;
    const productHoldings = holdings
      .filter((h) => h.productId === id)
      .map((h) => ({ ...h, customer: customers.find((c) => c.id === h.customerId)! }))
      .sort((a, b) => b.amount - a.amount);
    return { ...product, holdings: productHoldings };
  },

  'product.holders': (input) => {
    const { productId } = (input || {}) as { productId: string };
    return holdings
      .filter((h) => h.productId === productId)
      .map((h) => ({ ...h, customer: customers.find((c) => c.id === h.customerId)! }))
      .sort((a, b) => b.amount - a.amount);
  },

  'product.all': () =>
    products
      .filter((p) => p.status === 'active')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((p) => ({ id: p.id, code: p.code, name: p.name, type: p.type })),

  // -------- customer --------
  'customer.list': (input) => {
    const { riskPreference, keyword, salespersonId, page = 1, pageSize = 10 } = (input || {}) as {
      riskPreference?: string;
      keyword?: string;
      salespersonId?: string;
      page?: number;
      pageSize?: number;
    };
    let list = [...customers];
    if (riskPreference) list = list.filter((c) => c.riskPreference === riskPreference);
    if (keyword) list = list.filter((c) => c.name.includes(keyword));
    if (salespersonId) list = list.filter((c) => c.salespersonId === salespersonId);
    list.sort((a, b) => b.totalAssets - a.totalAssets);
    const paged = paginate(list, page, pageSize);
    return {
      data: paged.map(expandCustomer),
      total: list.length,
      page,
      pageSize,
    };
  },

  'customer.byId': (input) => {
    const { id } = (input || {}) as { id: string };
    const c = customers.find((x) => x.id === id);
    if (!c) return null;
    const sp = salespeople.find((s) => s.id === c.salespersonId) || null;
    const myHoldings = holdings
      .filter((h) => h.customerId === id)
      .map((h) => ({ ...h, product: products.find((p) => p.id === h.productId)! }))
      .sort((a, b) => b.amount - a.amount);
    const myFollowUps = followUps
      .filter((f) => f.customerId === id)
      .sort(byCreatedDesc)
      .slice(0, 10);
    const cts = customerTags
      .filter((ct) => ct.customerId === id)
      .map((ct) => ({ ...ct, tag: tags.find((t) => t.id === ct.tagId)! }));
    return { ...c, salesperson: sp, holdings: myHoldings, followUps: myFollowUps, tags: cts };
  },

  'customer.create': (input) => {
    const data = (input || {}) as Omit<MockCustomer, 'id' | 'createdAt' | 'updatedAt' | 'totalAssets'> & {
      totalAssets?: number;
    };
    const now = new Date();
    const newCustomer: MockCustomer = {
      id: nextId('c'),
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      riskPreference: data.riskPreference,
      totalAssets: data.totalAssets ?? 0,
      salespersonId: data.salespersonId,
      createdAt: now,
      updatedAt: now,
    };
    customers.push(newCustomer);
    return newCustomer;
  },

  'customer.holdings': (input) => {
    const { customerId } = (input || {}) as { customerId: string };
    return holdings
      .filter((h) => h.customerId === customerId)
      .map((h) => ({ ...h, product: products.find((p) => p.id === h.productId)! }))
      .sort((a, b) => b.amount - a.amount);
  },

  'customer.followUps': (input) => {
    const { customerId, page = 1, pageSize = 10 } = (input || {}) as {
      customerId: string;
      page?: number;
      pageSize?: number;
    };
    const list = followUps.filter((f) => f.customerId === customerId).sort(byCreatedDesc);
    const paged = paginate(list, page, pageSize).map((f) => ({
      ...f,
      salesperson: (() => {
        const sp = salespeople.find((s) => s.id === f.salespersonId);
        return sp ? { id: sp.id, name: sp.name } : null;
      })(),
    }));
    return { data: paged, total: list.length, page, pageSize };
  },

  // -------- followUp --------
  'followUp.list': (input) => {
    const { salespersonId, customerId, type, page = 1, pageSize = 20 } = (input || {}) as {
      salespersonId?: string;
      customerId?: string;
      type?: string;
      page?: number;
      pageSize?: number;
    };
    let list = [...followUps];
    if (salespersonId) list = list.filter((f) => f.salespersonId === salespersonId);
    if (customerId) list = list.filter((f) => f.customerId === customerId);
    if (type) list = list.filter((f) => f.type === type);
    list.sort(byCreatedDesc);
    const paged = paginate(list, page, pageSize).map((f) => {
      const c = customers.find((x) => x.id === f.customerId);
      const sp = salespeople.find((s) => s.id === f.salespersonId);
      return {
        ...f,
        customer: c ? { id: c.id, name: c.name } : null,
        salesperson: sp ? { id: sp.id, name: sp.name } : null,
      };
    });
    return { data: paged, total: list.length, page, pageSize };
  },

  'followUp.create': (input) => {
    const { relatedProductIds, ...rest } = (input || {}) as {
      customerId: string;
      salespersonId: string;
      type: MockFollowUp['type'];
      content: string;
      relatedProductIds?: string[];
    };
    const newFollowUp: MockFollowUp = {
      id: nextId('fu'),
      ...rest,
      relatedProductIds: relatedProductIds ? JSON.stringify(relatedProductIds) : null,
      createdAt: new Date(),
    };
    followUps.unshift(newFollowUp);
    return newFollowUp;
  },

  'followUp.recent': (input) => {
    const { salespersonId, limit = 5 } = (input || {}) as {
      salespersonId?: string;
      limit?: number;
    };
    const list = [...followUps].sort(byCreatedDesc);
    const filtered = salespersonId ? list.filter((f) => f.salespersonId === salespersonId) : list;
    return filtered.slice(0, limit).map((f) => {
      const c = customers.find((x) => x.id === f.customerId);
      return { ...f, customer: c ? { id: c.id, name: c.name } : null };
    });
  },

  // -------- statistics --------
  'statistics.overview': (input) => {
    const { salespersonId } = (input || {}) as { salespersonId?: string };
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeProducts = products.filter((p) => p.status === 'active');
    const customerList = salespersonId ? customers.filter((c) => c.salespersonId === salespersonId) : customers;
    const newCustomerCount = customerList.filter((c) => c.createdAt >= startOfMonth).length;
    const followUpList = salespersonId ? followUps.filter((f) => f.salespersonId === salespersonId) : followUps;
    const followUpCount = followUpList.filter((f) => f.createdAt >= startOfMonth).length;
    const totalAum = activeProducts.reduce((s, p) => s + p.aum, 0);

    return {
      totalAum,
      aumChange: 3.2,
      productCount: activeProducts.length,
      newProductCount: 2,
      customerCount: customerList.length,
      newCustomerCount,
      followUpCount,
      followUpTarget: 50,
    };
  },

  'statistics.aumTrend': () => {
    const months = ['2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04'];
    const baseAum = 10;
    return months.map((date, index) => ({
      date,
      aum: baseAum + index * 0.5 + Math.random() * 0.5,
    }));
  },

  'statistics.productDistribution': () => {
    const active = products.filter((p) => p.status === 'active');
    const map = new Map<string, { count: number; aum: number }>();
    for (const p of active) {
      const cur = map.get(p.type) || { count: 0, aum: 0 };
      cur.count += 1;
      cur.aum += p.aum;
      map.set(p.type, cur);
    }
    return Array.from(map.entries()).map(([type, v]) => ({
      type: type as ProductType,
      typeName: PRODUCT_TYPE_MAP[type as ProductType] || type,
      count: v.count,
      aum: v.aum,
    }));
  },

  'statistics.serviceStats': (input) => {
    const { salespersonId } = (input || {}) as { salespersonId?: string };
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const list = followUps
      .filter((f) => f.createdAt >= startOfMonth)
      .filter((f) => (salespersonId ? f.salespersonId === salespersonId : true));

    const byTypeMap = new Map<string, number>();
    for (const f of list) byTypeMap.set(f.type, (byTypeMap.get(f.type) || 0) + 1);
    const byType = Array.from(byTypeMap.entries()).map(([type, count]) => ({
      type: type as FollowUpType,
      typeName: FOLLOW_UP_TYPE_MAP[type as FollowUpType] || type,
      count,
    }));

    const byCustomerMap = new Map<string, number>();
    for (const f of list) byCustomerMap.set(f.customerId, (byCustomerMap.get(f.customerId) || 0) + 1);
    const byCustomer = Array.from(byCustomerMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([customerId, count]) => ({
        customerId,
        customerName: customers.find((c) => c.id === customerId)?.name || '未知客户',
        count,
      }));

    const trend = [
      { date: '第1周', count: 8 },
      { date: '第2周', count: 12 },
      { date: '第3周', count: 15 },
      { date: '第4周', count: 10 },
    ];
    return { trend, byCustomer, byType };
  },

  'statistics.teamRanking': () => {
    const sales = salespeople.filter((s) => s.role === 'sales');
    const rankings = sales.map((sp) => {
      const myCustomers = customers.filter((c) => c.salespersonId === sp.id);
      const aum = myCustomers.reduce((sum, c) => sum + c.totalAssets, 0) / 10000;
      const customerCount = myCustomers.length;
      const followUpCount = followUps.filter((f) => f.salespersonId === sp.id).length;
      const newCustomerCount = Math.floor(Math.random() * 3) + 1;
      const score = Math.round(aum * 0.4 * 10 + followUpCount * 0.3 + newCustomerCount * 0.3 * 10);
      return {
        salespersonId: sp.id,
        salespersonName: sp.name,
        aum,
        customerCount,
        followUpCount,
        newCustomerCount,
        score,
      };
    });
    return rankings.sort((a, b) => b.score - a.score);
  },

  // -------- tag --------
  'tag.list': () =>
    [...tags].sort(byIdAsc).map((t) => ({
      ...t,
      _count: { customers: customerTags.filter((ct) => ct.tagId === t.id).length },
    })),

  'tag.create': (input) => {
    const { name, color } = (input || {}) as { name: string; color: string };
    const now = new Date();
    const newTag: MockTag = { id: nextId('tag'), name, color, createdAt: now, updatedAt: now };
    tags.push(newTag);
    return newTag;
  },

  'tag.delete': (input) => {
    const { id } = (input || {}) as { id: string };
    const idx = tags.findIndex((t) => t.id === id);
    if (idx >= 0) {
      const [removed] = tags.splice(idx, 1);
      for (let i = customerTags.length - 1; i >= 0; i--) {
        if (customerTags[i].tagId === id) customerTags.splice(i, 1);
      }
      return removed;
    }
    return null;
  },

  'tag.addToCustomer': (input) => {
    const { customerId, tagId } = (input || {}) as { customerId: string; tagId: string };
    const existing = customerTags.find((ct) => ct.customerId === customerId && ct.tagId === tagId);
    if (existing) return existing;
    const newCT: MockCustomerTag = {
      id: nextId('ct'),
      customerId,
      tagId,
      createdAt: new Date(),
    };
    customerTags.push(newCT);
    return newCT;
  },

  'tag.removeFromCustomer': (input) => {
    const { customerId, tagId } = (input || {}) as { customerId: string; tagId: string };
    let count = 0;
    for (let i = customerTags.length - 1; i >= 0; i--) {
      if (customerTags[i].customerId === customerId && customerTags[i].tagId === tagId) {
        customerTags.splice(i, 1);
        count++;
      }
    }
    return { count };
  },

  'tag.getByCustomer': (input) => {
    const { customerId } = (input || {}) as { customerId: string };
    return customerTags
      .filter((ct) => ct.customerId === customerId)
      .map((ct) => tags.find((t) => t.id === ct.tagId)!)
      .filter(Boolean);
  },

  // -------- agent --------
  'agent.chat': (input) => {
    const { messages } = (input || {}) as {
      messages: { role: 'user' | 'assistant'; content: string }[];
    };
    const last = messages[messages.length - 1]?.content || '';

    if (/产品|基金/.test(last)) {
      const top = [...products]
        .filter((p) => p.status === 'active')
        .sort((a, b) => b.aum - a.aum)
        .slice(0, 5)
        .map((p) => `· ${p.name}（${PRODUCT_TYPE_MAP[p.type]}，规模 ${p.aum.toFixed(2)}亿）`)
        .join('\n');
      return { content: `当前运作中规模前 5 的产品如下：\n${top}` };
    }

    if (/客户|持仓/.test(last)) {
      const top = [...customers]
        .sort((a, b) => b.totalAssets - a.totalAssets)
        .slice(0, 5)
        .map((c) => `· ${c.name}（持仓 ${c.totalAssets.toFixed(0)}万）`)
        .join('\n');
      return { content: `持仓规模前 5 的客户：\n${top}` };
    }

    if (/统计|概览|aum|规模/i.test(last)) {
      const active = products.filter((p) => p.status === 'active');
      const totalAum = active.reduce((s, p) => s + p.aum, 0);
      return {
        content: `当前客户数 ${customers.length}，运作中产品 ${active.length} 只，AUM 合计 ${totalAum.toFixed(2)} 亿。`,
      };
    }

    return {
      content: '你好，我是 FundOS 助手（Mock 模式）。可以问我：产品列表、客户持仓、整体统计等。',
    };
  },
};
