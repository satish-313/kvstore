import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "../pages/api/trpc/[trpc]";
import { verify } from "jsonwebtoken";
import { jwtPayload } from "../../types";

// Avoid exporting the entire t-object since it's not very
// descriptive and can be confusing to newcomers used to t
// meaning translation in i18n libraries.
const t = initTRPC.context<Context>().create();

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that checks if users are authenticated.
 * @note Example only, yours may vary depending on how your auth is setup
 **/
const isAuthed = t.middleware(({ next, ctx }) => {
  const access = ctx.session.headers["authorization"];

  if (access) {
    try {
      const Apayload: any = verify(access!, process.env.ACCESS_TOKEN_SECRET!);
      return next({
        ctx: {
          userId: Apayload.userId,
          isOk: true,
        },
      });
    } catch (error) {
    }
  }

  const refresh = ctx.session.cookies["helloReturnBalak"];
  
  if (refresh) {
    try {
      const Rpayload: any = verify(refresh!, process.env.REFRESH_TOKEN_SECRET!);
      return next({
        ctx: {
          userId: Rpayload.userId,
          isOk: true,
        },
      });
    } catch (error) {}
  }

  return next({
    ctx: {
      isOk: false,
      userId: null,
    },
  });
});

// Protected procedures for logged in users only
export const protectedProcedure = t.procedure.use(isAuthed);
