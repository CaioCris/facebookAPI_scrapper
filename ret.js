var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/redis';
var async = require("async");

//PEgar as informações do redis e salvar elas dentro do MongoDB
client.keys('*', function (err, keys) {
    MongoClient.connect(url, function (err, db) {
        async.each(keys, function (k, callback) {
            client.get(k, function (err, value) {
                var arquivos = db.collection('redis');
                arquivos.insert(JSON.parse(value), function (err, result) {
                    console.log(JSON.parse(value))
                    client.del(k)
                    callback();
                })
            })
        }, function(err){
            db.close();
            client.quit();
        })
    });
});