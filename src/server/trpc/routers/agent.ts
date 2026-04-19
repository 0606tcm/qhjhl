import { z } from 'zod';
import { router, publicProcedure } from '../index';
import { chat } from '../../services/agent';

export const agentRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      return chat(input.messages);
    }),
});
