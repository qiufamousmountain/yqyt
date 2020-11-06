const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const config = require('../config/config.json');
const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    db: config.redis.db,
});
client.auth(config.redis.password);
client.on("connect", () => {
    console.log('redis connected');
});

module.exports = client;