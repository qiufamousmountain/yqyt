
const { sql_moni } = require('../config/config.json');

const mysql = require('mysql');

const pool = mysql.createPool(sql_moni);
// 从连接池中获取一个连接



module.exports = { pool };