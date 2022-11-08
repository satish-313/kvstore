// export interface envUser {
//   _id: string;
//   name: string;
//   email: string;
//   email_verified: boolean;
//   picture: string;
// }

export interface jwtPayload {
  userId: string,
  iat: number,
  exp: number
}