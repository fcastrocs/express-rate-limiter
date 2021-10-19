import { MongoClient } from "mongodb";
import { NextFunction as Next, Request as Req, Response as Res } from "express";

declare module "express" {
  interface Request {
    session: { userId: string };
  }
}

export default function requestLimiter(options: Options): (req: Req, res: Res, next: Next) => Promise<void>;

export interface Options {
  client: MongoClient;
  excludePaths: string[];
  expireAfterSeconds: number;
}
