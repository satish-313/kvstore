import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import {
  publicProcedure,
  router,
  protectedProcedure,
  userIsAuthProcedure,
} from "../trpc";
import clientPromise from "../../db";
import { createAccessToken, createRefreshToken } from "../../utils/context";
import { ObjectId } from "mongodb";
import envUser from "../model/envUser";

export const appRouter = router({
  Iam: protectedProcedure.query(async ({ ctx }) => {
    const db = await clientPromise;
    const database = db.db("dbname");
    const envStoreUser = database.collection("env-user");
    let isUser = (await envStoreUser.findOne({
      _id: new ObjectId(`${ctx.userId}`),
    })) as envUser;
    let accessToken;
    if (ctx.cAT) {
      accessToken = createAccessToken(isUser._id!.toString());
    }
    if (ctx.rAT) {
      const refreshToken = createRefreshToken(isUser._id!.toString());
      ctx.res.setHeader(
        "set-cookie",
        `helloReturnBalak=${refreshToken}; path=/; samesite=lax; httponly;`
      );
    }
    return {
      user: isUser,
      accessToken: accessToken,
    };
  }),
  userIsAuth: userIsAuthProcedure.query(({ ctx }) => {
    return {
      userIsAuth: ctx.userIsAuth,
    };
  }),
  checkUser: publicProcedure
    .input(
      z.object({
        credential: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      async function verify(idToken: string) {
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
      }
      const payload = await verify(input.credential);

      const db = await clientPromise;
      const database = db.db("dbname");
      const envStoreUser = database.collection("env-user");
      const isUser = (await envStoreUser.findOne({
        email: payload?.email,
      })) as envUser;

      // new User
      let accessToken;
      let user;
      if (!isUser) {
        const newUser = {
          name: payload?.name,
          email: payload?.email,
          email_verified: payload?.email_verified,
          picture: payload?.picture,
        } as envUser;
        user = await envStoreUser.insertOne(newUser);

        const refreshToken = createRefreshToken(user.insertedId.toString());
        ctx.res.setHeader(
          "set-cookie",
          `helloReturnBalak=${refreshToken}; path=/; samesite=lax; httponly;`
        );
        accessToken = createAccessToken(user.insertedId.toString());
        return {
          validUser: true,
          accessToken,
        };
      }

      if (isUser) accessToken = createAccessToken(isUser._id!.toString());
      const refreshToken = createRefreshToken(isUser._id!.toString());
      ctx.res.setHeader(
        "set-cookie",
        `helloReturnBalak=${refreshToken}; path=/; samesite=lax; httponly;`
      );
      return {
        validUser: true,
        accessToken,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
