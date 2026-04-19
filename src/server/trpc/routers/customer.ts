import { z } from 'zod';
import { router, publicProcedure } from '../index';
import { prisma } from '../../db/client';

export const customerRouter = router({
  // 客户列表
  list: publicProcedure
    .input(
      z.object({
        riskPreference: z.enum(['conservative', 'stable', 'aggressive']).optional(),
        keyword: z.string().optional(),
        salespersonId: z.string().optional(),
        page: z.number().default(1),
        pageSize: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const { riskPreference, keyword, salespersonId, page, pageSize } = input;

      const where = {
        ...(riskPreference && { riskPreference }),
        ...(keyword && { name: { contains: keyword } }),
        ...(salespersonId && { salespersonId }),
      };

      const [data, total] = await Promise.all([
        prisma.customer.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { totalAssets: 'desc' },
          include: {
            salesperson: {
              select: { id: true, name: true },
            },
            tags: {
              include: { tag: true },
            },
            _count: {
              select: { holdings: true, followUps: true },
            },
          },
        }),
        prisma.customer.count({ where }),
      ]);

      return { data, total, page, pageSize };
    }),

  // 客户详情
  byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return prisma.customer.findUnique({
      where: { id: input.id },
      include: {
        salesperson: true,
        holdings: {
          include: { product: true },
          orderBy: { amount: 'desc' },
        },
        followUps: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        tags: {
          include: { tag: true },
        },
      },
    });
  }),

  // 新增客户
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
        email: z.string().email().optional(),
        riskPreference: z.enum(['conservative', 'stable', 'aggressive']),
        salespersonId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.customer.create({
        data: input,
      });
    }),

  // 客户持仓列表
  holdings: publicProcedure.input(z.object({ customerId: z.string() })).query(async ({ input }) => {
    return prisma.holding.findMany({
      where: { customerId: input.customerId },
      include: { product: true },
      orderBy: { amount: 'desc' },
    });
  }),

  // 客户跟进记录
  followUps: publicProcedure
    .input(
      z.object({
        customerId: z.string(),
        page: z.number().default(1),
        pageSize: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const { customerId, page, pageSize } = input;

      const [data, total] = await Promise.all([
        prisma.followUp.findMany({
          where: { customerId },
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
          include: {
            salesperson: {
              select: { id: true, name: true },
            },
          },
        }),
        prisma.followUp.count({ where: { customerId } }),
      ]);

      return { data, total, page, pageSize };
    }),
});
