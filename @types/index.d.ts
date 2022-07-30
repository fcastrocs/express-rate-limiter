import { MongoClient } from "mongodb";
import { NextFunction as Next, Request as Req, Response as Res } from "express";

export default function requestLimiter(options: Options): (req: Req, res: Res, next: Next) => Promise<void>;

export interface CompoundKey {
  userId: 1;
  path: 1;
  [key: string]: number;
}

export interface Options {
  client: MongoClient;
  collectionName: string;
  customField?: { name: string; reqBodyProp: string };
  excludePaths: string[];
  expireAfterSeconds: number;
}
