import { initTRPC } from "@trpc/server";
import { Context } from "../pages/api/trpc/[trpc]";
import { verify } from "jsonwebtoken";

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
  let Apayload: any;

  if (access) {
    try {
      Apayload = verify(access!, process.env.ACCESS_TOKEN_SECRET!);
    } catch (error) {}
  }

  if (Apayload) {
    return next({
      ctx: {
        userId: Apayload.userId as string,
        isAuth: true,
      },
    });
  }

  return next({
    ctx: {
      userId: "" as string,
      isAuth: false,
    },
  });
});

const userIsAuth = t.middleware(({ next, ctx }) => {
  const access = ctx.session.headers["authorization"];
  let Apayload: any;
  let Rpayload: any;

  if (access) {
    try {
      Apayload = verify(access!, process.env.ACCESS_TOKEN_SECRET!);
    } catch (error) {}
  }

  if (Apayload) {
    return next({
      ctx: {
        userIsAuth: true,
      },
    });
  }

  return next({
    ctx: {
      userIsAuth: false,
    },
  });
});
// Protected procedures for logged in users only
export const protectedProcedure = t.procedure.use(isAuthed);
export const userIsAuthProcedure = t.procedure.use(userIsAuth);
