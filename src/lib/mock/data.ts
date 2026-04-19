export interface MockSalesperson {
  id: string;
  name: string;
  avatar?: string | null;
  role: 'sales' | 'leader';
  teamId: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockProduct {
  id: string;
  code: string;
  name: string;
  type: 'stock' | 'bond' | 'hybrid' | 'money';
  nav: number;
  navDate: Date;
  navChange: number;
  aum: number;
  status: 'raising' | 'active' | 'liquidated';
  riskLevel: 'low' | 'medium' | 'high';
  manager: string;
  establishDate: Date;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  riskPreference: 'conservative' | 'stable' | 'aggressive';
  totalAssets: number;
  salespersonId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockHolding {
  id: string;
  amount: number;
  shares: number;
  cost: number;
  purchaseDate: Date;
  customerId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockFollowUp {
  id: string;
  type: 'call' | 'visit' | 'meeting' | 'other';
  content: string;
  relatedProductIds?: string | null;
  customerId: string;
  salespersonId: string;
  createdAt: Date;
}

export interface MockTag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockCustomerTag {
  id: string;
  customerId: string;
  tagId: string;
  createdAt: Date;
}

const now = new Date();

export const salespeople: MockSalesperson[] = [
  { id: 'sp001', name: '张明', role: 'sales', teamId: 'team001', phone: '13800138001', email: 'zhangming@fundos.com', createdAt: now, updatedAt: now },
  { id: 'sp002', name: '李芳', role: 'sales', teamId: 'team001', phone: '13800138002', email: 'lifang@fundos.com', createdAt: now, updatedAt: now },
  { id: 'sp003', name: '王强', role: 'sales', teamId: 'team001', phone: '13800138003', email: 'wangqiang@fundos.com', createdAt: now, updatedAt: now },
  { id: 'sp004', name: '赵雪', role: 'sales', teamId: 'team001', phone: '13800138004', email: 'zhaoxue@fundos.com', createdAt: now, updatedAt: now },
  { id: 'sp005', name: '陈总', role: 'leader', teamId: 'team001', phone: '13800138000', email: 'chenzong@fundos.com', createdAt: now, updatedAt: now },
];

export const products: MockProduct[] = [
  { id: 'p001', code: 'FD001', name: '价值精选一号', type: 'stock', nav: 2.3156, navDate: new Date('2025-04-17'), navChange: 1.25, aum: 8.7, status: 'active', riskLevel: 'high', manager: '刘伟', establishDate: new Date('2021-03-15'), description: '专注于价值投资，精选优质蓝筹股票。', createdAt: now, updatedAt: now },
  { id: 'p002', code: 'FD002', name: '成长动力A', type: 'stock', nav: 1.8234, navDate: new Date('2025-04-17'), navChange: -0.56, aum: 5.2, status: 'active', riskLevel: 'high', manager: '张华', establishDate: new Date('2022-06-20'), description: '聚焦成长型企业，捕捉高增长机会。', createdAt: now, updatedAt: now },
  { id: 'p003', code: 'FD003', name: '科技先锋', type: 'stock', nav: 0.9845, navDate: new Date('2025-04-17'), navChange: 2.18, aum: 3.1, status: 'raising', riskLevel: 'high', manager: '王芳', establishDate: new Date('2025-03-01'), description: '布局科技赛道，分享科技发展红利。', createdAt: now, updatedAt: now },
  { id: 'p004', code: 'FD004', name: '稳健增长一号', type: 'bond', nav: 1.0523, navDate: new Date('2025-04-17'), navChange: 0.08, aum: 12.5, status: 'active', riskLevel: 'low', manager: '李明', establishDate: new Date('2020-01-10'), description: '以债券投资为主，追求稳健收益。', createdAt: now, updatedAt: now },
  { id: 'p005', code: 'FD005', name: '纯债精选', type: 'bond', nav: 1.0234, navDate: new Date('2025-04-17'), navChange: 0.05, aum: 8.3, status: 'active', riskLevel: 'low', manager: '赵磊', establishDate: new Date('2021-08-15'), description: '纯债组合，低风险稳收益。', createdAt: now, updatedAt: now },
  { id: 'p006', code: 'FD006', name: '信用债优选', type: 'bond', nav: 1.0812, navDate: new Date('2025-04-17'), navChange: 0.12, aum: 6.7, status: 'active', riskLevel: 'medium', manager: '孙丽', establishDate: new Date('2022-02-28'), description: '精选高评级信用债，兼顾收益与安全。', createdAt: now, updatedAt: now },
  { id: 'p007', code: 'FD007', name: '平衡配置A', type: 'hybrid', nav: 1.4567, navDate: new Date('2025-04-17'), navChange: 0.45, aum: 7.8, status: 'active', riskLevel: 'medium', manager: '周杰', establishDate: new Date('2020-09-20'), description: '股债平衡配置，攻守兼备。', createdAt: now, updatedAt: now },
  { id: 'p008', code: 'FD008', name: '灵活配置二号', type: 'hybrid', nav: 1.2345, navDate: new Date('2025-04-17'), navChange: -0.23, aum: 4.5, status: 'active', riskLevel: 'medium', manager: '吴强', establishDate: new Date('2023-01-15'), description: '灵活调整股债比例，适应市场变化。', createdAt: now, updatedAt: now },
  { id: 'p009', code: 'FD009', name: '稳进增收', type: 'hybrid', nav: 0.8765, navDate: new Date('2025-04-17'), navChange: -1.05, aum: 2.1, status: 'liquidated', riskLevel: 'medium', manager: '郑涛', establishDate: new Date('2019-05-10'), description: '已清盘产品。', createdAt: now, updatedAt: now },
  { id: 'p010', code: 'FD010', name: '现金宝A', type: 'money', nav: 1.0, navDate: new Date('2025-04-17'), navChange: 0.01, aum: 15.6, status: 'active', riskLevel: 'low', manager: '钱进', establishDate: new Date('2018-06-01'), description: '货币基金，随时申赎，灵活便捷。', createdAt: now, updatedAt: now },
  { id: 'p011', code: 'FD011', name: '天天利', type: 'money', nav: 1.0, navDate: new Date('2025-04-17'), navChange: 0.008, aum: 10.2, status: 'active', riskLevel: 'low', manager: '孙悦', establishDate: new Date('2019-03-15'), description: '每日计息，收益稳定。', createdAt: now, updatedAt: now },
  { id: 'p012', code: 'FD012', name: '活期通', type: 'money', nav: 1.0, navDate: new Date('2025-04-17'), navChange: 0.009, aum: 8.9, status: 'active', riskLevel: 'low', manager: '林青', establishDate: new Date('2020-07-20'), description: 'T+0 快速赎回，方便快捷。', createdAt: now, updatedAt: now },
];

export const customers: MockCustomer[] = [
  { id: 'c001', name: '张总', phone: '13900139001', email: 'zhangzong@example.com', riskPreference: 'conservative', totalAssets: 850, salespersonId: 'sp001', createdAt: now, updatedAt: now },
  { id: 'c002', name: '李女士', phone: '13900139002', riskPreference: 'conservative', totalAssets: 320, salespersonId: 'sp001', createdAt: now, updatedAt: now },
  { id: 'c003', name: '王先生', phone: '13900139003', riskPreference: 'conservative', totalAssets: 150, salespersonId: 'sp002', createdAt: now, updatedAt: now },
  { id: 'c004', name: '赵阿姨', phone: '13900139004', riskPreference: 'conservative', totalAssets: 80, salespersonId: 'sp002', createdAt: now, updatedAt: now },
  { id: 'c005', name: '孙大爷', phone: '13900139005', riskPreference: 'conservative', totalAssets: 200, salespersonId: 'sp003', createdAt: now, updatedAt: now },
  { id: 'c006', name: '周总', phone: '13900139006', email: 'zhouzong@example.com', riskPreference: 'stable', totalAssets: 1200, salespersonId: 'sp001', createdAt: now, updatedAt: now },
  { id: 'c007', name: '吴经理', phone: '13900139007', riskPreference: 'stable', totalAssets: 650, salespersonId: 'sp002', createdAt: now, updatedAt: now },
  { id: 'c008', name: '郑女士', phone: '13900139008', riskPreference: 'stable', totalAssets: 480, salespersonId: 'sp003', createdAt: now, updatedAt: now },
  { id: 'c009', name: '冯先生', phone: '13900139009', riskPreference: 'stable', totalAssets: 380, salespersonId: 'sp003', createdAt: now, updatedAt: now },
  { id: 'c010', name: '陈总', phone: '13900139010', email: 'chenzong@example.com', riskPreference: 'stable', totalAssets: 920, salespersonId: 'sp004', createdAt: now, updatedAt: now },
  { id: 'c011', name: '林总', phone: '13900139011', email: 'linzong@example.com', riskPreference: 'aggressive', totalAssets: 2500, salespersonId: 'sp001', createdAt: now, updatedAt: now },
  { id: 'c012', name: '黄先生', phone: '13900139012', riskPreference: 'aggressive', totalAssets: 1800, salespersonId: 'sp002', createdAt: now, updatedAt: now },
  { id: 'c013', name: '徐女士', phone: '13900139013', riskPreference: 'aggressive', totalAssets: 960, salespersonId: 'sp003', createdAt: now, updatedAt: now },
  { id: 'c014', name: '马总', phone: '13900139014', email: 'mazong@example.com', riskPreference: 'aggressive', totalAssets: 3200, salespersonId: 'sp004', createdAt: now, updatedAt: now },
  { id: 'c015', name: '高先生', phone: '13900139015', riskPreference: 'aggressive', totalAssets: 750, salespersonId: 'sp004', createdAt: now, updatedAt: now },
];

let holdingSeq = 0;
const h = (customerId: string, productId: string, amount: number, shares: number, cost: number, purchaseDate: string): MockHolding => ({
  id: `hd${String(++holdingSeq).padStart(3, '0')}`,
  customerId,
  productId,
  amount,
  shares,
  cost,
  purchaseDate: new Date(purchaseDate),
  createdAt: now,
  updatedAt: now,
});

export const holdings: MockHolding[] = [
  h('c001', 'p004', 500, 475000, 1.0, '2024-01-15'),
  h('c001', 'p010', 200, 200000, 1.0, '2024-03-20'),
  h('c001', 'p005', 150, 146500, 1.0, '2024-06-10'),
  h('c006', 'p007', 600, 412000, 1.38, '2023-09-15'),
  h('c006', 'p004', 400, 380000, 1.02, '2024-02-28'),
  h('c006', 'p001', 200, 86400, 2.15, '2024-08-10'),
  h('c011', 'p001', 1500, 648000, 2.08, '2023-06-20'),
  h('c011', 'p002', 800, 438600, 1.65, '2024-01-05'),
  h('c011', 'p007', 200, 137300, 1.42, '2024-05-18'),
  h('c014', 'p001', 2000, 864000, 2.12, '2022-11-10'),
  h('c014', 'p002', 1000, 548200, 1.72, '2023-04-25'),
  h('c014', 'p003', 200, 203150, 0.98, '2025-03-05'),
  h('c002', 'p005', 200, 195500, 1.01, '2024-04-12'),
  h('c002', 'p011', 120, 120000, 1.0, '2024-07-08'),
  h('c007', 'p007', 400, 274600, 1.40, '2023-12-15'),
  h('c007', 'p006', 250, 231200, 1.06, '2024-05-22'),
  h('c012', 'p001', 1000, 432000, 2.18, '2024-02-18'),
  h('c012', 'p008', 500, 405000, 1.20, '2024-06-30'),
  h('c012', 'p010', 300, 300000, 1.0, '2024-09-15'),
];

let followUpSeq = 0;
const f = (customerId: string, salespersonId: string, type: MockFollowUp['type'], content: string, createdAt: string, relatedProductIds?: string[]): MockFollowUp => ({
  id: `fu${String(++followUpSeq).padStart(3, '0')}`,
  customerId,
  salespersonId,
  type,
  content,
  relatedProductIds: relatedProductIds ? JSON.stringify(relatedProductIds) : null,
  createdAt: new Date(createdAt),
});

export const followUps: MockFollowUp[] = [
  f('c001', 'sp001', 'call', '电话沟通稳健增长一号近期表现，客户表示满意，考虑追加投资。', '2025-04-17T10:30:00', ['p004']),
  f('c001', 'sp001', 'visit', '上门拜访，介绍了新发行的科技先锋基金，客户表示需要考虑。', '2025-04-15T14:00:00', ['p003']),
  f('c006', 'sp001', 'meeting', '在公司会议室详细讲解资产配置方案，客户认可混合型基金配置建议。', '2025-04-12T09:00:00', ['p007', 'p004']),
  f('c011', 'sp001', 'call', '林总询问科技先锋基金认购进展，已确认下周认购50万。', '2025-04-16T16:45:00', ['p003']),
  f('c002', 'sp001', 'call', '提醒客户纯债精选即将分红，建议选择红利再投资。', '2025-04-10T11:20:00', ['p005']),
  f('c003', 'sp002', 'call', '电话了解客户近期资金安排，客户表示暂无新增投资计划。', '2025-04-17T09:15:00'),
  f('c007', 'sp002', 'visit', '拜访吴经理，讨论公司年度理财规划，推荐了信用债优选。', '2025-04-14T10:30:00', ['p006']),
  f('c012', 'sp002', 'meeting', '黄先生来访，讨论股票型基金配置，对成长动力A感兴趣。', '2025-04-11T14:30:00', ['p002']),
  f('c004', 'sp002', 'call', '赵阿姨咨询货币基金收益情况，已详细解释。', '2025-04-08T15:45:00', ['p010', 'p011']),
  f('c005', 'sp003', 'call', '孙大爷询问债券基金安全性，已耐心解答。', '2025-04-16T10:00:00', ['p004', 'p005']),
  f('c008', 'sp003', 'visit', '拜访郑女士，介绍平衡配置基金，客户有意向认购。', '2025-04-13T11:00:00', ['p007']),
  f('c009', 'sp003', 'call', '冯先生询问灵活配置二号净值走势，已发送详细报告。', '2025-04-09T16:20:00', ['p008']),
  f('c013', 'sp003', 'meeting', '徐女士来访讨论投资组合调整，建议增配成长型基金。', '2025-04-07T09:30:00', ['p002', 'p001']),
  f('c010', 'sp004', 'call', '陈总咨询新发基金情况，对科技先锋有浓厚兴趣。', '2025-04-17T11:30:00', ['p003']),
  f('c014', 'sp004', 'visit', '马总办公室拜访，回顾一季度投资表现，客户非常满意。', '2025-04-15T15:00:00', ['p001', 'p002']),
  f('c015', 'sp004', 'call', '高先生询问价值精选一号分红计划，已告知预计下月分红。', '2025-04-12T14:15:00', ['p001']),
  f('c014', 'sp004', 'meeting', '马总参加公司季度投资策略会，对下半年市场持乐观态度。', '2025-04-05T10:00:00'),
];

export const tags: MockTag[] = [
  { id: 'tag001', name: 'VIP客户', color: '#D97706', createdAt: now, updatedAt: now },
  { id: 'tag002', name: '高净值', color: '#16A34A', createdAt: now, updatedAt: now },
  { id: 'tag003', name: '潜力客户', color: '#2563EB', createdAt: now, updatedAt: now },
  { id: 'tag004', name: '需跟进', color: '#DC2626', createdAt: now, updatedAt: now },
  { id: 'tag005', name: '长期持有', color: '#7C3AED', createdAt: now, updatedAt: now },
  { id: 'tag006', name: '企业客户', color: '#0891B2', createdAt: now, updatedAt: now },
];

let customerTagSeq = 0;
const ct = (customerId: string, tagId: string): MockCustomerTag => ({
  id: `ct${String(++customerTagSeq).padStart(3, '0')}`,
  customerId,
  tagId,
  createdAt: now,
});

export const customerTags: MockCustomerTag[] = [
  ct('c001', 'tag001'), ct('c006', 'tag001'), ct('c011', 'tag001'), ct('c014', 'tag001'),
  ct('c011', 'tag002'), ct('c014', 'tag002'), ct('c006', 'tag002'),
  ct('c007', 'tag003'), ct('c010', 'tag003'), ct('c012', 'tag003'),
  ct('c003', 'tag004'), ct('c005', 'tag004'),
  ct('c001', 'tag005'), ct('c014', 'tag005'),
  ct('c006', 'tag006'), ct('c010', 'tag006'),
];

export function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
