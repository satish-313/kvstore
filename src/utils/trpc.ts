import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../server/routers/_app";
import { getAccessToken, setAccessToken } from "./context";
import jwtDecode from "jwt-decode";

export function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers: async () => {
            let accessToken = getAccessToken("trpc context");

            if (accessToken === "FirstTime") {
              const url = getBaseUrl();
              const res = await fetch(`${url}/api/refresh_token`);
              accessToken = await res.text();
              setAccessToken(accessToken, "firt time");
            }
            try {
              const res: any = jwtDecode(accessToken);
              if (Date.now() >= res.exp * 1000) {
                const url = getBaseUrl();
                const res = await fetch(`${url}/api/refresh_token`);
                accessToken = await res.text();
                setAccessToken(accessToken, "expire time time");
              }
            } catch (error) {
              console.log("error trpc util ", error);
            }

            return {
              Authorization: accessToken,
            };
          },
        }),
      ],
    };
  },
  ssr: false,
});
