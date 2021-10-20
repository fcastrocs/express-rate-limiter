# express-rate-limiter

`express-rate-limit` is a simple, but effective express.js rate limiter by `userid` and `route path`. It allows one request at a time. <br />
While, this is an opionated module, it can be extended and modified to your needs.<br />

It takes the `userid` from `req.session.userId` and the path from `req.path`<br />
`MongoDB` is used for the store.

## Installation
```shell
npm install @machiavelli/express-rate-limiter
```

## Usage
```js
import rateLimiter from '@machiavelli/express-rate-limiter';
app.use(rateLimiter({options}));
```

### options
```js
{
  client: MongoClient;
  excludePaths: string[];
  expireAfterSeconds: number; // limiter will be removed after this many seconds.
}
