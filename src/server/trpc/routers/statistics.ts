import { z } from 'zod';
import { router, publicProcedure } from '../index';
import { prisma } from '../../db/client';
import { PRODUCT_TYPE_MAP, FOLLOW_UP_TYPE_MAP } from '@/types';
import type { ProductType, FollowUpType } from '@/types';

export const statisticsRouter = router({
  // Dashboard 概览数据
  overview: publicProcedure
    .input(
      z.object({
        salespersonId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { salespersonId } = input;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // 基础查询条件
      const customerWhere = salespersonId ? { salespersonId } : {};
      const followUpWhere = salespersonId ? { salespersonId } : {};

      const [
        productCount,
        customerCount,
        newCustomerCount,
        totalAum,
        followUpCount,
      ] = await Promise.all([
        prisma.product.count({ where: { status: 'active' } }),
        prisma.customer.count({ where: customerWhere }),
        prisma.customer.count({
          where: {
            ...customerWhere,
            createdAt: { gte: startOfMonth },
          },
        }),
        prisma.product.aggregate({
          where: { status: 'active' },
          _sum: { aum: true },
        }),
        prisma.followUp.count({
          where: {
            ...followUpWhere,
            createdAt: { gte: startOfMonth },
          },
        }),
      ]);

      return {
        totalAum: totalAum._sum.aum || 0,
        aumChange: 3.2, // Mock 数据
        productCount,
        newProductCount: 2, // Mock 数据
        customerCount,
        newCustomerCount,
        followUpCount,
        followUpTarget: 50, // Mock 目标值
      };
    }),

  // AUM 趋势数据
  aumTrend: publicProcedure.query(async () => {
    // 返回 Mock 数据（实际应该聚合历史数据）
    const months = ['2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04'];
    const baseAum = 10;

    return months.map((date, index) => ({
      date,
      aum: baseAum + index * 0.5 + Math.random() * 0.5,
    }));
  }),

  // 产品类型分布
  productDistribution: publicProcedure.query(async () => {
    const products = await prisma.product.groupBy({
      by: ['type'],
      where: { status: 'active' },
      _count: { id: true },
      _sum: { aum: true },
    });

    return products.map((p) => ({
      type: p.type as ProductType,
      typeName: PRODUCT_TYPE_MAP[p.type as ProductType] || p.type,
      count: p._count.id,
      aum: p._sum.aum || 0,
    }));
  }),

  // 服务统计（销售视角）
  serviceStats: publicProcedure
    .input(
      z.object({
        salespersonId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { salespersonId } = input;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const where = {
        ...(salespersonId && { salespersonId }),
        createdAt: { gte: startOfMonth },
      };

      // 按类型统计
      const byTypeData = await prisma.followUp.groupBy({
        by: ['type'],
        where,
        _count: { id: true },
      });

      const byType = byTypeData.map((item) => ({
        type: item.type as FollowUpType,
        typeName: FOLLOW_UP_TYPE_MAP[item.type as FollowUpType] || item.type,
        count: item._count.id,
      }));

      // 按客户统计（Top 5）
      const byCustomerData = await prisma.followUp.groupBy({
        by: ['customerId'],
        where,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      });

      const customerIds = byCustomerData.map((item) => item.customerId);
      const customers = await prisma.customer.findMany({
        where: { id: { in: customerIds } },
        select: { id: true, name: true },
      });

      const customerMap = new Map(customers.map((c) => [c.id, c.name]));

      const byCustomer = byCustomerData.map((item) => ({
        customerId: item.customerId,
        customerName: customerMap.get(item.customerId) || '未知客户',
        count: item._count.id,
      }));

      // 趋势数据（按周）
      const trend = [
        { date: '第1周', count: 8 },
        { date: '第2周', count: 12 },
        { date: '第3周', count: 15 },
        { date: '第4周', count: 10 },
      ];

      return { trend, byCustomer, byType };
    }),

  // 团队排行（团队长视角）
  teamRanking: publicProcedure.query(async () => {
    const salespeople = await prisma.salesperson.findMany({
      where: { role: 'sales' },
      include: {
        customers: {
          select: { totalAssets: true },
        },
        followUps: {
          select: { id: true },
        },
        _count: {
          select: { customers: true, followUps: true },
        },
      },
    });

    const rankings = salespeople.map((sp) => {
      const aum = sp.customers.reduce((sum, c) => sum + c.totalAssets, 0) / 10000; // 转为亿
      const customerCount = sp._count.customers;
      const followUpCount = sp._count.followUps;
      const newCustomerCount = Math.floor(Math.random() * 3) + 1; // Mock

      // 综合评分 = AUM×0.4 + 跟进数×0.3 + 新客户数×0.3
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
  }),
});
