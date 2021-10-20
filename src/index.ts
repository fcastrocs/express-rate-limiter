import { NextFunction as Next, Response as Res, Request as Req } from "express";
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

    const userId = (req as any).session.userId;
    const query = { userId, path: req.path, steamUsername: req.body.username };

    if (await collection.findOne(query)) {
      res.status(403).send("You have an ongoing request for this resource.");
      return;
    }

    await collection.insertOne({ ...query, createdAt: new Date() });

    res.on("finish", () => {
      collection.deleteOne(query);
    });

    next();
  };
}
