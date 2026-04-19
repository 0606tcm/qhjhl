import { z } from 'zod';
import { router, publicProcedure } from '../index';
import { prisma } from '../../db/client';

export const productRouter = router({
  // 产品列表
  list: publicProcedure
    .input(
      z.object({
        type: z.enum(['stock', 'bond', 'hybrid', 'money']).optional(),
        status: z.enum(['raising', 'active', 'liquidated']).optional(),
        keyword: z.string().optional(),
        page: z.number().default(1),
        pageSize: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const { type, status, keyword, page, pageSize } = input;

      const where = {
        ...(type && { type }),
        ...(status && { status }),
        ...(keyword && { name: { contains: keyword } }),
      };

      const [data, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { aum: 'desc' },
        }),
        prisma.product.count({ where }),
      ]);

      return { data, total, page, pageSize };
    }),

  // 产品详情
  byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return prisma.product.findUnique({
      where: { id: input.id },
      include: {
        holdings: {
          include: { customer: true },
          orderBy: { amount: 'desc' },
        },
      },
    });
  }),

  // 产品持有客户列表
  holders: publicProcedure.input(z.object({ productId: z.string() })).query(async ({ input }) => {
    return prisma.holding.findMany({
      where: { productId: input.productId },
      include: { customer: true },
      orderBy: { amount: 'desc' },
    });
  }),

  // 所有产品（不分页，用于下拉选择）
  all: publicProcedure.query(async () => {
    return prisma.product.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        type: true,
      },
    });
  }),
});
