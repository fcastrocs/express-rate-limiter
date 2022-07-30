# express-rate-limiter

`express-rate-limit` is a simple, but effective express.js rate limiter by `req.session.userId` and `req.path` as a compound unique key. optionally another field from req.body can be added to the compound key through `options.customField`
Allows one request at a time.
`MongoDB` is used for the store.

## Usage
```js
import rateLimiter from '@machiavelli/express-rate-limiter';
app.use(rateLimiter({options}));
```

### options
```js
{
  client: MongoClient;        // MongoDb client
  collectionName: string;     // collection for store
  customField?: { name: string; reqBodyProp: string }; // custom field to be added to compound key
  excludePaths: string[];     // route paths to exclude from rate limit
  expireAfterSeconds: number; // after how many seconds rate limit expires
}
