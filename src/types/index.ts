// ============ 基础枚举类型 ============

/** 产品类型 */
export type ProductType = 'stock' | 'bond' | 'hybrid' | 'money';

/** 产品状态 */
export type ProductStatus = 'raising' | 'active' | 'liquidated';

/** 风险等级 */
export type RiskLevel = 'low' | 'medium' | 'high';

/** 客户风险偏好 */
export type RiskPreference = 'conservative' | 'stable' | 'aggressive';

/** 跟进方式 */
export type FollowUpType = 'call' | 'visit' | 'meeting' | 'other';

/** 用户角色 */
export type UserRole = 'sales' | 'leader';

/** 当前视角 */
export type ViewMode = 'sales' | 'leader';

// ============ 常量映射 ============

export const PRODUCT_TYPE_MAP: Record<ProductType, string> = {
  stock: '股票型',
  bond: '债券型',
  hybrid: '混合型',
  money: '货币型',
};

export const PRODUCT_STATUS_MAP: Record<ProductStatus, string> = {
  raising: '募集中',
  active: '运作中',
  liquidated: '已清盘',
};

export const RISK_LEVEL_MAP: Record<RiskLevel, string> = {
  low: '低风险',
  medium: '中风险',
  high: '高风险',
};

export const RISK_PREFERENCE_MAP: Record<RiskPreference, string> = {
  conservative: '保守型',
  stable: '稳健型',
  aggressive: '积极型',
};

export const FOLLOW_UP_TYPE_MAP: Record<FollowUpType, string> = {
  call: '电话',
  visit: '拜访',
  meeting: '会议',
  other: '其他',
};

// ============ 统计类型 ============

/** Dashboard 概览数据 */
export interface DashboardStats {
  totalAum: number;
  aumChange: number;
  productCount: number;
  newProductCount: number;
  customerCount: number;
  newCustomerCount: number;
  followUpCount: number;
  followUpTarget: number;
}

/** AUM 趋势数据 */
export interface AumTrendData {
  date: string;
  aum: number;
}

/** 产品类型分布 */
export interface ProductTypeDistribution {
  type: ProductType;
  typeName: string;
  count: number;
  aum: number;
}

/** 服务统计 */
export interface ServiceStats {
  trend: { date: string; count: number }[];
  byCustomer: { customerId: string; customerName: string; count: number }[];
  byType: { type: FollowUpType; typeName: string; count: number }[];
}

/** 团队排行 */
export interface TeamRanking {
  salespersonId: string;
  salespersonName: string;
  aum: number;
  customerCount: number;
  followUpCount: number;
  newCustomerCount: number;
  score: number;
}

// ============ Agent 相关类型 ============

/** Agent 消息 */
export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  data?: AgentResponseData;
  timestamp: Date;
}

/** Agent 响应数据 */
export interface AgentResponseData {
  type: 'text' | 'query_result' | 'chart' | 'form_data';
  queryResult?: {
    title: string;
    columns: { key: string; title: string }[];
    data: Record<string, unknown>[];
    actions?: { label: string; action: string; params?: Record<string, unknown> }[];
  };
  chartConfig?: {
    type: 'pie' | 'line' | 'bar';
    title: string;
    data: unknown;
  };
  formData?: {
    formType: 'followUp';
    prefilled: Record<string, unknown>;
  };
}
