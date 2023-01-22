import { AppRouter } from "./server.ts";
import {
  createTRPCProxyClient,
  httpLink,
} from "https://esm.sh/@trpc/client@10.9.0";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: "http://localhost:5005/trpc",
    }),
  ],
});

try {
  {
    const query = await client.helloWorld.query();
    console.log(JSON.stringify(query));
  }
  {
    const query = await client.createSomething.mutate({ name: "kohe" });
    console.log(JSON.stringify(query));
  }
} catch (e) {
  console.error(e);
}

//deno run --allow-net client.ts
