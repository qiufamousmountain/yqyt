/**
 * Created by zhengliuyang on 2018/10/11.
 */
var crypto = require('crypto');
var algrithm = 'aes-128-cbc';
var blockSize = 16;




exports.encrypt = function (password, text) {
    let buf = Buffer.from(text);
    let iv = crypto.randomBytes(blockSize);
    buf = Buffer.concat([iv, buf]);
    let cipher = crypto.createCipheriv(algrithm, password, iv);
    let encrypted = Buffer.concat([cipher.update(buf), cipher.final()]);
    return encrypted.toString('base64');
};

exports.decrypt = function (password, data) {
    let buf = Buffer.from(data, 'base64');
    let iv = buf.slice(0, blockSize);
    let decipher = crypto.createDecipheriv(algrithm, password, iv);
    let decrypted = decipher.update(buf.slice(blockSize));
    decrypted += decipher.final();
    return decrypted.toString('utf8');
};
