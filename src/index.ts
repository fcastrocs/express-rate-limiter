import { NextFunction as Next, Request as Req, Response as Res } from "express";
import { Options } from "../typings";

export default function requestLimiter(options: Options): (req: Req, res: Res, next: Next) => Promise<void> {
  const collection = options.client.db().collection("rate-limiter");
  collection.createIndex({ userId: 1, path: 1, steamUsername: 1 }, { unique: true });
  collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: options.expireAfterSeconds });

  return async function (req: Req, res: Res, next: Next) {
    if (options.excludePaths.includes(req.path)) {
      next();
      return;
    }
    if (await collection.findOne({ userId: req.session.userId, path: req.path })) {
      res.status(403).send("You have an ongoing request for this resource.");
      return;
    }

    await collection.insertOne({ userId: req.session.userId, path: req.path, createdAt: new Date() });

    req.on("end", () => {
      collection.deleteOne({ userId: req.session.userId, path: req.path });
    });

    next();
  };
}
