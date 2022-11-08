import { ObjectId } from "mongodb";

export default class envUser {
  constructor(
    public name: string,
    public email: string,
    public email_verified: boolean,
    public picture: string,
    public _id?: ObjectId
  ) {}
}
