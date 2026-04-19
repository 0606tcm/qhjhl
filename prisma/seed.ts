import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始填充数据...');

  // 清空现有数据
  await prisma.customerTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.holding.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.salesperson.deleteMany();

  // 创建销售人员
  const salespeople = await Promise.all([
    prisma.salesperson.create({
      data: {
        id: 'sp001',
        name: '张明',
        role: 'sales',
        teamId: 'team001',
        phone: '13800138001',
        email: 'zhangming@fundos.com',
      },
    }),
    prisma.salesperson.create({
      data: {
        id: 'sp002',
        name: '李芳',
        role: 'sales',
        teamId: 'team001',
        phone: '13800138002',
        email: 'lifang@fundos.com',
      },
    }),
    prisma.salesperson.create({
      data: {
        id: 'sp003',
        name: '王强',
        role: 'sales',
        teamId: 'team001',
        phone: '13800138003',
        email: 'wangqiang@fundos.com',
      },
    }),
    prisma.salesperson.create({
      data: {
        id: 'sp004',
        name: '赵雪',
        role: 'sales',
        teamId: 'team001',
        phone: '13800138004',
        email: 'zhaoxue@fundos.com',
      },
    }),
    prisma.salesperson.create({
      data: {
        id: 'sp005',
        name: '陈总',
        role: 'leader',
        teamId: 'team001',
        phone: '13800138000',
        email: 'chenzong@fundos.com',
      },
    }),
  ]);

  console.log(`创建了 ${salespeople.length} 个销售人员`);

  // 创建产品
  const products = await Promise.all([
    // 股票型
    prisma.product.create({
      data: {
        id: 'p001',
        code: 'FD001',
        name: '价值精选一号',
        type: 'stock',
        nav: 2.3156,
        navDate: new Date('2025-04-17'),
        navChange: 1.25,
        aum: 8.7,
        status: 'active',
        riskLevel: 'high',
        manager: '刘伟',
        establishDate: new Date('2021-03-15'),
        description: '专注于价值投资，精选优质蓝筹股票。',
      },
    }),
    prisma.product.create({
      data: {
        id: 'p002',
        code: 'FD002',
        name: '成长动力A',
        type: 'stock',
        nav: 1.8234,
        navDate: new Date('2025-04-17'),
        navChange: -0.56,
        aum: 5.2,
        status: 'active',
        riskLevel: 'high',
        manager: '张华',
        establishDate: new Date('2022-06-20'),
        description: '聚焦成长型企业，捕捉高增长机会。',
      },
    }),
    prisma.product.create({
      data: {
        id: 'p003',
        code: 'FD003',
        name: '科技先锋',
        type: 'stock',
        nav: 0.9845,
        navDate: new Date('2025-04-17'),
        navChange: 2.18,
        aum: 3.1,
        status: 'raising',
        riskLevel: 'high',
        manager: '王芳',
        establishDate: new Date('2025-03-01'),
        description: '布局科技赛道，分享科技发展红利。',
      },
    }),
    // 债券型
    prisma.product.create({
      data: {
        id: 'p004',
        code: 'FD004',
        name: '稳健增长一号',
        type: 'bond',
        nav: 1.0523,
        navDate: new Date('2025-04-17'),
        navChange: 0.08,
        aum: 12.5,
        status: 'active',
        riskLevel: 'low',
        manager: '李明',
        establishDate: new Date('2020-01-10'),
        description: '以债券投资为主，追求稳健收益。',
      },
    }),
    prisma.product.create({
      data: {
        id: 'p005',
        code: 'FD005',
        name: '纯债精选',
        type: 'bond',
        nav: 1.0234,
        navDate: new Date('2025-04-17'),
        navChange: 0.05,
        aum: 8.3,
        status: 'active',
        riskLevel: 'low',
        manager: '赵磊',
        establishDate: new Date('2021-08-15'),
        description: '纯债组合，低风险稳收益。',
      },
    }),
    prisma.product.create({
      data: {
        id: 'p006',
        code: 'FD006',
        name: '信用债优选',
        type: 'bond',
        nav: 1.0812,
        navDate: new Date('2025-04-17'),
        navChange: 0.12,
        aum: 6.7,
        status: 'active',
        riskLevel: 'medium',
        manager: '孙丽',
        establishDate: new Date('2022-02-28'),
        description: '精选高评级信用债，兼顾收益与安全。',
      },
    }),
    // 混合型
    prisma.product.create({
      data: {
        id: 'p007',
        code: 'FD007',
        name: '平衡配置A',
        type: 'hybrid',
        nav: 1.4567,
        navDate: new Date('2025-04-17'),
        navChange: 0.45,
        aum: 7.8,
        status: 'active',
        riskLevel: 'medium',
        manager: '周杰',
        establishDate: new Date('2020-09-20'),
        description: '股债平衡配置，攻守兼备。',
      },
    }),
    prisma.product.create({
      data: {
        id: 'p008',
        code: 'FD008',
        name: '灵活配置二号',
        type: 'hybrid',
        nav: 1.2345,
        navDate: new Date('2025-04-17'),
        navChange: -0.23,
        aum: 4.5,
        status: 'active',
        riskLevel: 'medium',
        manager: '吴强',
        establishDate: new Date('2023-01-15'),
        description: '灵活调整股债比例，适应市场变化。',
      },
    }),
    prisma.product.create({
      data: {
        id: 'p009',
        code: 'FD009',
        name: '稳进增收',
        type: 'hybrid',
        nav: 0.8765,
        navDate: new Date('2025-04-17'),
        navChange: -1.05,
        aum: 2.1,
        status: 'liquidated',
        riskLevel: 'medium',
        manager: '郑涛',
        establishDate: new Date('2019-05-10'),
        description: '已清盘产品。',
      },
    }),
    // 货币型
    prisma.product.create({
      data: {
        id: 'p010',
        code: 'FD010',
        name: '现金宝A',
        type: 'money',
        nav: 1.0,
        navDate: new Date('2025-04-17'),
        navChange: 0.01,
        aum: 15.6,
        status: 'active',
        riskLevel: 'low',
        manager: '钱进',
        establishDate: new Date('2018-06-01'),
        description: '货币基金，随时申赎，灵活便捷。',
      },
    }),
    prisma.product.create({
      data: {
        id: 'p011',
        code: 'FD011',
        name: '天天利',
        type: 'money',
        nav: 1.0,
        navDate: new Date('2025-04-17'),
        navChange: 0.008,
        aum: 10.2,
        status: 'active',
        riskLevel: 'low',
        manager: '孙悦',
        establishDate: new Date('2019-03-15'),
        description: '每日计息，收益稳定。',
      },
    }),
    prisma.product.create({
      data: {
        id: 'p012',
        code: 'FD012',
        name: '活期通',
        type: 'money',
        nav: 1.0,
        navDate: new Date('2025-04-17'),
        navChange: 0.009,
        aum: 8.9,
        status: 'active',
        riskLevel: 'low',
        manager: '林青',
        establishDate: new Date('2020-07-20'),
        description: 'T+0 快速赎回，方便快捷。',
      },
    }),
  ]);

  console.log(`创建了 ${products.length} 个产品`);

  // 创建客户
  const customers = await Promise.all([
    // 保守型客户
    prisma.customer.create({
      data: {
        id: 'c001',
        name: '张总',
        phone: '13900139001',
        email: 'zhangzong@example.com',
        riskPreference: 'conservative',
        totalAssets: 850,
        salespersonId: 'sp001',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c002',
        name: '李女士',
        phone: '13900139002',
        riskPreference: 'conservative',
        totalAssets: 320,
        salespersonId: 'sp001',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c003',
        name: '王先生',
        phone: '13900139003',
        riskPreference: 'conservative',
        totalAssets: 150,
        salespersonId: 'sp002',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c004',
        name: '赵阿姨',
        phone: '13900139004',
        riskPreference: 'conservative',
        totalAssets: 80,
        salespersonId: 'sp002',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c005',
        name: '孙大爷',
        phone: '13900139005',
        riskPreference: 'conservative',
        totalAssets: 200,
        salespersonId: 'sp003',
      },
    }),
    // 稳健型客户
    prisma.customer.create({
      data: {
        id: 'c006',
        name: '周总',
        phone: '13900139006',
        email: 'zhouzong@example.com',
        riskPreference: 'stable',
        totalAssets: 1200,
        salespersonId: 'sp001',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c007',
        name: '吴经理',
        phone: '13900139007',
        riskPreference: 'stable',
        totalAssets: 650,
        salespersonId: 'sp002',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c008',
        name: '郑女士',
        phone: '13900139008',
        riskPreference: 'stable',
        totalAssets: 480,
        salespersonId: 'sp003',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c009',
        name: '冯先生',
        phone: '13900139009',
        riskPreference: 'stable',
        totalAssets: 380,
        salespersonId: 'sp003',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c010',
        name: '陈总',
        phone: '13900139010',
        email: 'chenzong@example.com',
        riskPreference: 'stable',
        totalAssets: 920,
        salespersonId: 'sp004',
      },
    }),
    // 积极型客户
    prisma.customer.create({
      data: {
        id: 'c011',
        name: '林总',
        phone: '13900139011',
        email: 'linzong@example.com',
        riskPreference: 'aggressive',
        totalAssets: 2500,
        salespersonId: 'sp001',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c012',
        name: '黄先生',
        phone: '13900139012',
        riskPreference: 'aggressive',
        totalAssets: 1800,
        salespersonId: 'sp002',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c013',
        name: '徐女士',
        phone: '13900139013',
        riskPreference: 'aggressive',
        totalAssets: 960,
        salespersonId: 'sp003',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c014',
        name: '马总',
        phone: '13900139014',
        email: 'mazong@example.com',
        riskPreference: 'aggressive',
        totalAssets: 3200,
        salespersonId: 'sp004',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'c015',
        name: '高先生',
        phone: '13900139015',
        riskPreference: 'aggressive',
        totalAssets: 750,
        salespersonId: 'sp004',
      },
    }),
  ]);

  console.log(`创建了 ${customers.length} 个客户`);

  // 创建持仓关系
  const holdings = await Promise.all([
    // 张总的持仓
    prisma.holding.create({
      data: {
        customerId: 'c001',
        productId: 'p004',
        amount: 500,
        shares: 475000,
        cost: 1.0,
        purchaseDate: new Date('2024-01-15'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c001',
        productId: 'p010',
        amount: 200,
        shares: 200000,
        cost: 1.0,
        purchaseDate: new Date('2024-03-20'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c001',
        productId: 'p005',
        amount: 150,
        shares: 146500,
        cost: 1.0,
        purchaseDate: new Date('2024-06-10'),
      },
    }),
    // 周总的持仓
    prisma.holding.create({
      data: {
        customerId: 'c006',
        productId: 'p007',
        amount: 600,
        shares: 412000,
        cost: 1.38,
        purchaseDate: new Date('2023-09-15'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c006',
        productId: 'p004',
        amount: 400,
        shares: 380000,
        cost: 1.02,
        purchaseDate: new Date('2024-02-28'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c006',
        productId: 'p001',
        amount: 200,
        shares: 86400,
        cost: 2.15,
        purchaseDate: new Date('2024-08-10'),
      },
    }),
    // 林总的持仓
    prisma.holding.create({
      data: {
        customerId: 'c011',
        productId: 'p001',
        amount: 1500,
        shares: 648000,
        cost: 2.08,
        purchaseDate: new Date('2023-06-20'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c011',
        productId: 'p002',
        amount: 800,
        shares: 438600,
        cost: 1.65,
        purchaseDate: new Date('2024-01-05'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c011',
        productId: 'p007',
        amount: 200,
        shares: 137300,
        cost: 1.42,
        purchaseDate: new Date('2024-05-18'),
      },
    }),
    // 马总的持仓
    prisma.holding.create({
      data: {
        customerId: 'c014',
        productId: 'p001',
        amount: 2000,
        shares: 864000,
        cost: 2.12,
        purchaseDate: new Date('2022-11-10'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c014',
        productId: 'p002',
        amount: 1000,
        shares: 548200,
        cost: 1.72,
        purchaseDate: new Date('2023-04-25'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c014',
        productId: 'p003',
        amount: 200,
        shares: 203150,
        cost: 0.98,
        purchaseDate: new Date('2025-03-05'),
      },
    }),
    // 更多持仓...
    prisma.holding.create({
      data: {
        customerId: 'c002',
        productId: 'p005',
        amount: 200,
        shares: 195500,
        cost: 1.01,
        purchaseDate: new Date('2024-04-12'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c002',
        productId: 'p011',
        amount: 120,
        shares: 120000,
        cost: 1.0,
        purchaseDate: new Date('2024-07-08'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c007',
        productId: 'p007',
        amount: 400,
        shares: 274600,
        cost: 1.40,
        purchaseDate: new Date('2023-12-15'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c007',
        productId: 'p006',
        amount: 250,
        shares: 231200,
        cost: 1.06,
        purchaseDate: new Date('2024-05-22'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c012',
        productId: 'p001',
        amount: 1000,
        shares: 432000,
        cost: 2.18,
        purchaseDate: new Date('2024-02-18'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c012',
        productId: 'p008',
        amount: 500,
        shares: 405000,
        cost: 1.20,
        purchaseDate: new Date('2024-06-30'),
      },
    }),
    prisma.holding.create({
      data: {
        customerId: 'c012',
        productId: 'p010',
        amount: 300,
        shares: 300000,
        cost: 1.0,
        purchaseDate: new Date('2024-09-15'),
      },
    }),
  ]);

  console.log(`创建了 ${holdings.length} 个持仓记录`);

  // 创建跟进记录
  const followUps = await Promise.all([
    // 张明的跟进记录
    prisma.followUp.create({
      data: {
        customerId: 'c001',
        salespersonId: 'sp001',
        type: 'call',
        content: '电话沟通稳健增长一号近期表现，客户表示满意，考虑追加投资。',
        relatedProductIds: JSON.stringify(['p004']),
        createdAt: new Date('2025-04-17T10:30:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c001',
        salespersonId: 'sp001',
        type: 'visit',
        content: '上门拜访，介绍了新发行的科技先锋基金，客户表示需要考虑。',
        relatedProductIds: JSON.stringify(['p003']),
        createdAt: new Date('2025-04-15T14:00:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c006',
        salespersonId: 'sp001',
        type: 'meeting',
        content: '在公司会议室详细讲解资产配置方案，客户认可混合型基金配置建议。',
        relatedProductIds: JSON.stringify(['p007', 'p004']),
        createdAt: new Date('2025-04-12T09:00:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c011',
        salespersonId: 'sp001',
        type: 'call',
        content: '林总询问科技先锋基金认购进展，已确认下周认购50万。',
        relatedProductIds: JSON.stringify(['p003']),
        createdAt: new Date('2025-04-16T16:45:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c002',
        salespersonId: 'sp001',
        type: 'call',
        content: '提醒客户纯债精选即将分红，建议选择红利再投资。',
        relatedProductIds: JSON.stringify(['p005']),
        createdAt: new Date('2025-04-10T11:20:00'),
      },
    }),
    // 李芳的跟进记录
    prisma.followUp.create({
      data: {
        customerId: 'c003',
        salespersonId: 'sp002',
        type: 'call',
        content: '电话了解客户近期资金安排，客户表示暂无新增投资计划。',
        createdAt: new Date('2025-04-17T09:15:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c007',
        salespersonId: 'sp002',
        type: 'visit',
        content: '拜访吴经理，讨论公司年度理财规划，推荐了信用债优选。',
        relatedProductIds: JSON.stringify(['p006']),
        createdAt: new Date('2025-04-14T10:30:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c012',
        salespersonId: 'sp002',
        type: 'meeting',
        content: '黄先生来访，讨论股票型基金配置，对成长动力A感兴趣。',
        relatedProductIds: JSON.stringify(['p002']),
        createdAt: new Date('2025-04-11T14:30:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c004',
        salespersonId: 'sp002',
        type: 'call',
        content: '赵阿姨咨询货币基金收益情况，已详细解释。',
        relatedProductIds: JSON.stringify(['p010', 'p011']),
        createdAt: new Date('2025-04-08T15:45:00'),
      },
    }),
    // 王强的跟进记录
    prisma.followUp.create({
      data: {
        customerId: 'c005',
        salespersonId: 'sp003',
        type: 'call',
        content: '孙大爷询问债券基金安全性，已耐心解答。',
        relatedProductIds: JSON.stringify(['p004', 'p005']),
        createdAt: new Date('2025-04-16T10:00:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c008',
        salespersonId: 'sp003',
        type: 'visit',
        content: '拜访郑女士，介绍平衡配置基金，客户有意向认购。',
        relatedProductIds: JSON.stringify(['p007']),
        createdAt: new Date('2025-04-13T11:00:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c009',
        salespersonId: 'sp003',
        type: 'call',
        content: '冯先生询问灵活配置二号净值走势，已发送详细报告。',
        relatedProductIds: JSON.stringify(['p008']),
        createdAt: new Date('2025-04-09T16:20:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c013',
        salespersonId: 'sp003',
        type: 'meeting',
        content: '徐女士来访讨论投资组合调整，建议增配成长型基金。',
        relatedProductIds: JSON.stringify(['p002', 'p001']),
        createdAt: new Date('2025-04-07T09:30:00'),
      },
    }),
    // 赵雪的跟进记录
    prisma.followUp.create({
      data: {
        customerId: 'c010',
        salespersonId: 'sp004',
        type: 'call',
        content: '陈总咨询新发基金情况，对科技先锋有浓厚兴趣。',
        relatedProductIds: JSON.stringify(['p003']),
        createdAt: new Date('2025-04-17T11:30:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c014',
        salespersonId: 'sp004',
        type: 'visit',
        content: '马总办公室拜访，回顾一季度投资表现，客户非常满意。',
        relatedProductIds: JSON.stringify(['p001', 'p002']),
        createdAt: new Date('2025-04-15T15:00:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c015',
        salespersonId: 'sp004',
        type: 'call',
        content: '高先生询问价值精选一号分红计划，已告知预计下月分红。',
        relatedProductIds: JSON.stringify(['p001']),
        createdAt: new Date('2025-04-12T14:15:00'),
      },
    }),
    prisma.followUp.create({
      data: {
        customerId: 'c014',
        salespersonId: 'sp004',
        type: 'meeting',
        content: '马总参加公司季度投资策略会，对下半年市场持乐观态度。',
        createdAt: new Date('2025-04-05T10:00:00'),
      },
    }),
  ]);

  console.log(`创建了 ${followUps.length} 条跟进记录`);

  // 创建客户标签
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        id: 'tag001',
        name: 'VIP客户',
        color: '#D97706',
      },
    }),
    prisma.tag.create({
      data: {
        id: 'tag002',
        name: '高净值',
        color: '#16A34A',
      },
    }),
    prisma.tag.create({
      data: {
        id: 'tag003',
        name: '潜力客户',
        color: '#2563EB',
      },
    }),
    prisma.tag.create({
      data: {
        id: 'tag004',
        name: '需跟进',
        color: '#DC2626',
      },
    }),
    prisma.tag.create({
      data: {
        id: 'tag005',
        name: '长期持有',
        color: '#7C3AED',
      },
    }),
    prisma.tag.create({
      data: {
        id: 'tag006',
        name: '企业客户',
        color: '#0891B2',
      },
    }),
  ]);

  console.log(`创建了 ${tags.length} 个标签`);

  // 为部分客户添加标签
  const customerTags = await Promise.all([
    // VIP客户
    prisma.customerTag.create({ data: { customerId: 'c001', tagId: 'tag001' } }),
    prisma.customerTag.create({ data: { customerId: 'c006', tagId: 'tag001' } }),
    prisma.customerTag.create({ data: { customerId: 'c011', tagId: 'tag001' } }),
    prisma.customerTag.create({ data: { customerId: 'c014', tagId: 'tag001' } }),
    // 高净值
    prisma.customerTag.create({ data: { customerId: 'c011', tagId: 'tag002' } }),
    prisma.customerTag.create({ data: { customerId: 'c014', tagId: 'tag002' } }),
    prisma.customerTag.create({ data: { customerId: 'c006', tagId: 'tag002' } }),
    // 潜力客户
    prisma.customerTag.create({ data: { customerId: 'c007', tagId: 'tag003' } }),
    prisma.customerTag.create({ data: { customerId: 'c010', tagId: 'tag003' } }),
    prisma.customerTag.create({ data: { customerId: 'c012', tagId: 'tag003' } }),
    // 需跟进
    prisma.customerTag.create({ data: { customerId: 'c003', tagId: 'tag004' } }),
    prisma.customerTag.create({ data: { customerId: 'c005', tagId: 'tag004' } }),
    // 长期持有
    prisma.customerTag.create({ data: { customerId: 'c001', tagId: 'tag005' } }),
    prisma.customerTag.create({ data: { customerId: 'c014', tagId: 'tag005' } }),
    // 企业客户
    prisma.customerTag.create({ data: { customerId: 'c006', tagId: 'tag006' } }),
    prisma.customerTag.create({ data: { customerId: 'c010', tagId: 'tag006' } }),
  ]);

  console.log(`创建了 ${customerTags.length} 个客户标签关联`);

  console.log('数据填充完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
