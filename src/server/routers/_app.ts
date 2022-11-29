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
import { envUser, envProject } from "../model/envUser";

export const appRouter = router({
  Iam: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.isAuth) {
      return {
        user: null,
        accessToken: undefined,
        isAuth: false,
      };
    }

    const db = await clientPromise;
    const database = db.db("dbname");
    const envStoreUser = database.collection("env-user");
    let user;

    let test = envStoreUser.aggregate([
      {
        $match: { _id: new ObjectId(ctx.userId) },
      },
      {
        $lookup: {
          from: "env-project",
          localField: "_id",
          foreignField: "clientId",
          as: "projects",
        },
      },
    ]);
    const allUser = await test.toArray();
    user = allUser[0] as envUser;

    let accessToken = "";
    if (ctx.cAT) {
      accessToken = createAccessToken(user._id!.toString());
    }
    if (ctx.rAT) {
      const refreshToken = createRefreshToken(user._id!.toString());
      ctx.res.setHeader(
        "set-cookie",
        `helloReturnBalak=${refreshToken}; path=/; samesite=Strict; httponly;`
      );
    }

    return {
      user,
      accessToken: accessToken,
      isAuth: ctx.isAuth,
    };
  }),
  addProject: protectedProcedure
    .input(
      z.object({
        projectName: z.string(),
        githubName: z.string().nullable(),
        secrets: z.record(z.string(), z.string()).array().nullable(),
        _id: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.isAuth) {
        return {
          isAuth: false,
        };
      }

      const { _id, secrets, projectName, githubName } = input;

      const db = await clientPromise;
      const database = db.db("dbname");
      const envStoreProject = database.collection("env-project");

      if (input._id === null) {
        const newProject = {
          projectName,
          clientId: new ObjectId(ctx.userId),
          githubName,
          secrets,
        } as envProject;

        try {
          await envStoreProject.insertOne(newProject);
        } catch (error) {
          console.log(error);
        }
      }

      return {
        ok: "success",
      };
    }),
  deleteProject: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { _id } = input;
      const db = await clientPromise;
      const database = db.db("dbname");
      const envStoreProject = database.collection("env-project");

      try {
        await envStoreProject.deleteOne({ _id: new ObjectId(_id) });
      } catch (error) {
        console.log(error);
      }

      return {
        ok : "success"
      }
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
      let maxAge = 7 * 86400;
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
          `helloReturnBalak=${refreshToken}; path=/; samesite=Strict; httponly; max-age=${maxAge}; secure;`
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
        `helloReturnBalak=${refreshToken}; path=/; samesite=Strict; httponly; max-age=${maxAge}; secure;`
      );

      return {
        validUser: true,
        accessToken,
      };
    }),
});

export type AppRouter = typeof appRouter;
