const redis = require("redis");
const config = require('../config/config.json');
const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    // db: config.redis.db,
});
// client.auth(config.redis.password);
client.on("connect", () => {
    console.log('--------redis连接成功--------');
});
client.on('error', (error) => {
    console.log('redis连接失败：' + error);
});
module.exports = client;