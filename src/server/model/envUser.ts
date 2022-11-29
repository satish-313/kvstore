import { ObjectId } from "mongodb";

export class envUser {
  constructor(
    public name: string,
    public email: string,
    public email_verified: boolean,
    public picture: string,
    public _id?: ObjectId,
    public projects? : envProject[]
  ) {}
}

interface secretType {
  [key: string]: string;
}

export class envProject {
  constructor(
    public projectName: string,
    public clientId: ObjectId,
    public githubName?: string,
    public secrets?: secretType[],
    public _id?: ObjectId
  ) {}
}
