import { observable } from '@trpc/server/observable';
import type { TRPCLink } from '@trpc/client';
import { TRPCClientError } from '@trpc/client';
import type { AppRouter } from '@/server/trpc/router';
import { mockHandlers } from './handlers';

const MIN_DELAY = 120;
const MAX_DELAY = 320;

export const mockLink: TRPCLink<AppRouter> = () => {
  return ({ op }) => {
    return observable((observer) => {
      const handler = mockHandlers[op.path];
      const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);

      const timer = setTimeout(async () => {
        if (!handler) {
          observer.error(
            new TRPCClientError(`No mock handler for path: ${op.path}`)
          );
          return;
        }
        try {
          const result = await handler(op.input as Record<string, unknown> | undefined);
          observer.next({ result: { data: result } });
          observer.complete();
        } catch (err) {
          observer.error(
            err instanceof TRPCClientError
              ? err
              : new TRPCClientError((err as Error)?.message || 'Mock handler error')
          );
        }
      }, delay);

      return () => clearTimeout(timer);
    });
  };
};
