import { z } from 'zod';
import { router, publicProcedure } from '../index';
import { prisma } from '../../db/client';

export const followUpRouter = router({
  // 跟进记录列表
  list: publicProcedure
    .input(
      z.object({
        salespersonId: z.string().optional(),
        customerId: z.string().optional(),
        type: z.enum(['call', 'visit', 'meeting', 'other']).optional(),
        page: z.number().default(1),
        pageSize: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const { salespersonId, customerId, type, page, pageSize } = input;

      const where = {
        ...(salespersonId && { salespersonId }),
        ...(customerId && { customerId }),
        ...(type && { type }),
      };

      const [data, total] = await Promise.all([
        prisma.followUp.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: {
              select: { id: true, name: true },
            },
            salesperson: {
              select: { id: true, name: true },
            },
          },
        }),
        prisma.followUp.count({ where }),
      ]);

      return { data, total, page, pageSize };
    }),

  // 新增跟进记录
  create: publicProcedure
    .input(
      z.object({
        customerId: z.string(),
        salespersonId: z.string(),
        type: z.enum(['call', 'visit', 'meeting', 'other']),
        content: z.string().min(1),
        relatedProductIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { relatedProductIds, ...rest } = input;
      return prisma.followUp.create({
        data: {
          ...rest,
          relatedProductIds: relatedProductIds ? JSON.stringify(relatedProductIds) : null,
        },
      });
    }),

  // 最近跟进记录
  recent: publicProcedure
    .input(
      z.object({
        salespersonId: z.string().optional(),
        limit: z.number().default(5),
      })
    )
    .query(async ({ input }) => {
      const { salespersonId, limit } = input;

      return prisma.followUp.findMany({
        where: salespersonId ? { salespersonId } : undefined,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, name: true },
          },
        },
      });
    }),
});
