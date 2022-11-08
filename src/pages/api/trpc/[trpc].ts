import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers/_app";
import { inferAsyncReturnType } from "@trpc/server";

// export API handler
const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const session = { headers: req.headers, cookies: req.cookies };
  return { session, res };
};

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});

export type Context = inferAsyncReturnType<typeof createContext>;
