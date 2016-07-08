/**
 * Created by deng on 16-6-5.
 */
var config = require("../config.js");
var mysql = require('mcd ysql');
/**
 * Created by deng on 16-4-11.
 */
var conn = mysql.createConnection(config.database_info);
exports.getUsersByQuery = function (query) {
    var selectUser = 'SELECT * FROM users WHERE name =? or email = ? ';
    var selectParams = [query.name, query.email];
    conn.query(selectUser, selectParams, function (err, rows, fields) {
        if (err) {
            return;
        }
        if (rows.length >= 1) {
            return true;
        } else {
            return false;

        }

    });
};
exports.getUserByLoginName = function (loginname, pass, callback) {
    var selectUser = 'SELECT * FROM users WHERE name =? and pwd = ?';
    var selectParams = [loginname, pass];
    conn.query(selectUser, selectParams, function (err, rows, fields) {
        if (err) {
            return;
        }
        if (rows.length >= 1) {
            callback = true;

        } else {
            callback = false

        }
        return callback;
    });
};
exports.getUserByMail = function (loginname, pass) {
    var selectUser = 'SELECT * FROM users WHERE email =? and pwd = ?';
    var selectParams = [loginname, pass];
    conn.query(selectUser, selectParams, function (err, rows, fields) {
        if (err) {
            return;
        }
        if (rows.length >= 1) {
            return true;
        } else {
            return false;

        }

    });
};
