import { NextFunction as Next, Response as Res, Request as Req } from "express";
import { CompoundKey, Options } from "../@types";

export default function requestLimiter(options: Options): (req: Req, res: Res, next: Next) => Promise<void> {
  const collection = options.client.db().collection(options.collectionName);

  // create compound key to look for when rate limiting
  // default is {userId: req.session.userId, path: req.path}
  // optionally another field from req.body can be added through options.customField
  const compoundKey: CompoundKey = { userId: 1, path: 1 };
  if (options.customField) compoundKey[options.customField.name] = 1;
  collection.createIndex(compoundKey, { unique: true });
  collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: options.expireAfterSeconds });

  return async function (req: Req, res: Res, next: Next) {
    if (options.excludePaths.includes(req.path)) return next();

    // build query
    const query = <any>{ userId: (req as any).session.userId, path: req.path };
    if (options.customField) query[options.customField.name] = req.body[options.customField.reqBodyProp];

    if (await collection.findOne(query)) {
      res.status(403).send("You have an ongoing request for this resource.");
      return;
    }

    await collection.insertOne({ ...query, createdAt: new Date() });

    // remove rate limit when request finishes
    res.on("finish", () => collection.deleteOne(query));

    next();
  };
}
