var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/facebook';
var async = require("async");

//Pegar as informações do redis e salvar elas dentro do MongoDB
client.keys('*', function (err, keys) {
    MongoClient.connect(url, function (err, db) {
        async.forEachLimit(keys, 100, function (k, callback) {
            client.get(k, function (err, value) {
                var type = k.split(":");
                if (type[1] == "posts") {
                    var arquivos = db.collection('posts');
                } else if (type[1] == "comments") {
                    var arquivos = db.collection('comments');
                } else {
                    var arquivos = db.collection('likes');
                }
                arquivos.insert(JSON.parse(value), function (err, result) {
                    console.log(JSON.parse(value))
                    client.del(k)
                    callback();
                })
            })
        }, function (err) {
            db.close();
            client.quit();
        })
    });
});