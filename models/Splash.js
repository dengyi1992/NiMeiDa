/**
 * Created by deng on 16-7-9.
 */
var mongodb = require('./db');
function Splash(filename, name) {
    this.filename = filename;
    this.name = name;
}
module.exports = Splash;

Splash.prototype.save = function (callback) {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    //要存入数据库的文档
    var splash = {
        name: this.name,
        filename: this.filename,
        time: time
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 duobaos 集合
        db.collection('splashs', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将文档插入  集合
            collection.insert(splash, {
                safe: true
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null);//返回 err 为 null
            });
        });
    });
};
