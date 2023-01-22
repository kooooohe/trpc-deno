import * as trpc from "https://esm.sh/@trpc/server@10.9.0";
import { z } from "https://deno.land/x/zod@v3.20.2/mod.ts";
 
const t = trpc.initTRPC.create();
 
const router = t.router;
const publicProcedure = t.procedure;
 
interface Something {
  id: number;
  name: string;
}
 
 
const appRouter = router({
  helloWorld: publicProcedure.query((req) => {
    return 'Hello World'
  }),
  createSomething: publicProcedure.input(z.object({name: z.string()}))
  .mutation((req) => {
    const s = Math.random();
    const sm:Something = {id:s, name: req.input.name}
    return  sm
  }),
});
 
export type AppRouter = typeof appRouter;



import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import { fetchRequestHandler } from 'npm:@trpc/server/adapters/fetch';

function handler(request: any) {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: request,
    // @ts-ignore
    router: appRouter,
    createContext: () => ({}),
  });
}

serve(handler);
//deno run --allow-net --allow-env --allow-read --allow-ffi --unstable server.ts