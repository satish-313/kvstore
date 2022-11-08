import { sign } from "jsonwebtoken";

let accessToken = "";

export const setAccessToken = (s: string) => (accessToken = s);

export const getAccessToken = () => accessToken;

export const createRefreshToken = (id:string) => {
  return sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const createAccessToken = (id: string) => {
  return sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
};