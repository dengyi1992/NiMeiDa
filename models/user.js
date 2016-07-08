/**
 * Created by deng on 16-4-18.
 */
var mongodb = require('./db');
var crypto = require('crypto');
var Duobao = require('./duobao');
function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.user_collection = user.user_collection;
    this.account = user.account;
};

module.exports = User;

//存储用户信息
User.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
//要存入数据库的用户信息文档
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        user_collection: this.user_collection,
        account: parseInt(20),
        head: head
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(user, {
                safe: true
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

//读取用户信息
User.get = function (name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};
/**
 * 收藏操作
 * @param name
 * @param callback
 *
 */
User.collection_c = function (name, coll, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        var collection = db.collection('users');
        var wherestr = {"name": name};
        var updateStr = {$set: {"user_collection": coll}}
        collection.update(wherestr, updateStr, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            callback(err, result);

        })
    });
};
/**
 *
 * @param name
 * @param adid
 * @param icons
 * @param callback
 */
User.add_account = function (name, adid, icons, callback) {
    //打开数据库
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {

                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                var collection = db.collection('users');
                var wherestr = {"name": name};
                var updateStr = {$set: {"account": parseInt(user.account) + parseInt(icons)}};
                collection.update(wherestr, updateStr, function (err, result) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(err, result);

                })
            });
        });
    });
};
/**
 * 支付扣余额
 * @param name
 * @param cost
 * @param callback
 */
User.pay = function (ordernumber, name, cost, callback) {
    //打开数据库
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {

                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                if (parseInt(user.account) < parseInt(cost)) {
                    return callback('余额不足...')
                }
                var collection = db.collection('users');
                var wherestr = {"name": name};
                var updateStr = {$set: {"account": parseInt(user.account) - parseInt(cost)}};
                collection.update(wherestr, updateStr, function (err, result) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    Duobao.pay(ordernumber, function (error) {
                        if (error) {
                            return callback(error.message);
                        }
                    });
                    callback(err, result);

                })

            });
        });
    });
};
User.changePass = function (name, password, newpassword, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {

                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                var collection = db.collection('users');
                var wherestr = {"name": name, "password": password};
                var updateStr = {$set: {"password": newpassword}};
                collection.update(wherestr, updateStr, function (err, result) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(err, result);

                })
            });
        });
    });
};