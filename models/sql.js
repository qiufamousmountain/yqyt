
const { sql_s } = require('../config/config.json');

const mysql = require('mysql');

const pool = mysql.createPool(sql_s);
// 从连接池中获取一个连接



module.exports = { pool };