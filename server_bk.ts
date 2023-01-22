
// @deno-types="npm:@types/express" 
import express from "npm:express@4";
import * as trpc from "https://esm.sh/@trpc/server@10.9.0";
import * as trpcExpress from "https://esm.sh/@trpc/server@10.9.0/adapters/express";
import { z } from "https://deno.land/x/zod@v3.20.2/mod.ts";
export const t = trpc.initTRPC.create();

declare global {
  namespace Express {
    export interface Request {
      id: string
    }
  }
}


// setup tRPC router
// const appRouter = trpc.router().query("hw", {
//   resolve() {
//     const data = { hello: "world" };
//     return data;
//   },
// });
export const appRouter = t.router({
  getUser: t.procedure.input(z.string()).query((req) => {
    req.input; // string
    return { id: req.input, name: 'Bilbo' };
  }),
  createUser: t.procedure
    .input(z.object({ name: z.string().min(5) }))
    .mutation((req) => {
      // use your ORM of choice
      return 'crated a user'
        
    }),
});



// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = trpc.inferAsyncReturnType<typeof createContext>;

const app = express();

//app.use(
//  "/trpc",
//  trpcExpress.createExpressMiddleware({
//    router: appRouter,
//    createContext,
//  }),
//);
const tmp = 
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })

app.use(
  '/trpc',
  tmp ,
);
//app.get("/", (req, res) => {
//  res.send("Hello World!");
//});

app.listen(5005, () => {
  console.log("Server running on port 5005");
});

export type AppRouter = typeof appRouter; // tRPC type-only export

//deno run --allow-net --allow-env --allow-read --allow-ffi --unstable server.ts
