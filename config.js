/**
 * config
 */

var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: true,
    address: 'http://123.206.84.242:2888/',

    upload: {
        path: path.join(__dirname, 'public/images/'),
        url: '/public/upload/'
    },



    /**
     * 错误
     */
    err_params: {msg: "err_params", content: "参数错误"},
    err_database: {msg: "err_database", content: "数据库错误"},
    err_userinfo: {msg: "err_userinfo", content: "用户信息错误"}

};

if (process.env.NODE_ENV === 'test') {
    config.db = 'mongodb://127.0.0.1/node_club_test';
}

module.exports = config;
