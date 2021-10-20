import { MongoClient } from "mongodb";
import { NextFunction as Next, Request, Response as Res } from "express";

interface ExtendedReq extends Request {
  session: { userId: string };
}

export default function requestLimiter(options: Options): (req: ExtendedReq, res: Res, next: Next) => Promise<void>;

export interface Options {
  client: MongoClient;
  excludePaths: string[];
  expireAfterSeconds: number;
}
