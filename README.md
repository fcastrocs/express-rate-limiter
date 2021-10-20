# express-rate-limiter

`express-rate-limit` is a simple, but effective express.js rate limiter by `userid`. It allows one request at a time. <br />
While, this is an opionated module, it can be extended and modified to your needs.

It takes the `userid` from `req.session.userId`<br />
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
  expireAfterSeconds: number;
}
