import { sign } from "jsonwebtoken";
let accessToken = "FirstTime";

export const createRefreshToken = (id: string) => {
  return sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const createAccessToken = (id: string) => {
  return sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
};



export const setAccessToken = (s: string, from: string) => {
  console.log("set access token", s, "from ", from);
  accessToken = s;
};

export const getAccessToken = (from: string) => {
  console.log("get access token ", accessToken, " from ", from);
  return accessToken;
}