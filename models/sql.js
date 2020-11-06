
const config = require('../config/config.json');

const mysql = require('mysql');
const connection = mysql.createConnection(config.sql);




module.exports = {
    connection: connection,
};