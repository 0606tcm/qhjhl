import { z } from 'zod';
import { router, publicProcedure } from '../index';
import { prisma } from '../../db/client';

export const tagRouter = router({
  // 获取所有标签
  list: publicProcedure.query(async () => {
    return prisma.tag.findMany({
      include: {
        _count: {
          select: { customers: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }),

  // 创建标签
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        color: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.tag.create({
        data: input,
      });
    }),

  // 删除标签
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.tag.delete({
        where: { id: input.id },
      });
    }),

  // 为客户添加标签
  addToCustomer: publicProcedure
    .input(
      z.object({
        customerId: z.string(),
        tagId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.customerTag.create({
        data: {
          customerId: input.customerId,
          tagId: input.tagId,
        },
      });
    }),

  // 从客户移除标签
  removeFromCustomer: publicProcedure
    .input(
      z.object({
        customerId: z.string(),
        tagId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.customerTag.deleteMany({
        where: {
          customerId: input.customerId,
          tagId: input.tagId,
        },
      });
    }),

  // 获取客户的标签
  getByCustomer: publicProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input }) => {
      const customerTags = await prisma.customerTag.findMany({
        where: { customerId: input.customerId },
        include: { tag: true },
      });
      return customerTags.map((ct) => ct.tag);
    }),
});
