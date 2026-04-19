import { router } from './index';
import { productRouter } from './routers/product';
import { customerRouter } from './routers/customer';
import { followUpRouter } from './routers/followUp';
import { statisticsRouter } from './routers/statistics';
import { agentRouter } from './routers/agent';
import { tagRouter } from './routers/tag';

export const appRouter = router({
  product: productRouter,
  customer: customerRouter,
  followUp: followUpRouter,
  statistics: statisticsRouter,
  agent: agentRouter,
  tag: tagRouter,
});

export type AppRouter = typeof appRouter;
