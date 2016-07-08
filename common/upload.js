/**
 * Created by deng on 16-6-5.
 */
var querystring = require('querystring');
var util = require('util');
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var config = require('../config.js');


exports.upload = function (req, res, next) {
    /* 上传页面 */
    res.sendFile(config.upload.path_uploadpage + "upload.html");


};

exports.uploadfile = function (req, res, next) {
    console.log(req.body, req.files);
    var path = req.files.userPhoto.path;
    var s = path.substring(5,path.length);
    var des_file = config.upload.path + s;
    fs.readFile(path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            var response;
            if (err) {
                console.log(err);
                res.end(JSON.stringify(err));

            } else {
                response = {
                    message: 'File uploaded successfully',
                    filename: config.url+'/upload/'+ s
                };
                console.log(response);
                res.end(JSON.stringify(response));

            }
        });
    });

};
