const e = require('express');
const logger = require('../../lib/logger');
var db_conn = require('../core/data_connection');

function getUserLogs() {
    let sql = "SELECT * from user_logs";
    return new Promise(function(resolve, reject) {
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            //console.log(rows);
            resolve(rows);
        });
    });
}

module.exports = {
    getUserLogs
}