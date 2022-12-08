import type { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../../utils/context";

export default function (req: NextApiRequest, res: NextApiResponse) {
  const refresh = req.cookies["helloReturnBalak"];
  let Rpayload: any;

  if (!refresh) {
    return res.send("no error")
  }

  if (refresh) {
    try {
      Rpayload = verify(refresh!, process.env.REFRESH_TOKEN_SECRET!);
    } catch (error) {
      return res.status(401).json("error no cookie")
    }
  }
  
  let refreshToken = createRefreshToken(Rpayload.userId);
  let accessToken = createAccessToken(Rpayload.userId)
  let maxAge = 7 * 86400;

  res.setHeader(
    "set-cookie",
    `helloReturnBalak=${refreshToken}; path=/; samesite=Strict; httponly; max-age=${maxAge}; secure;`
  );

  return res.send(accessToken);
}
