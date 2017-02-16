const async = require('async');
const request = require('request');
var MongoClient = require('mongodb').MongoClient

async.waterfall([
    getPrincipal,
    getLikes
], function (err) {
    db.close();
});

MongoClient.connect(config.MONGO_URI, function(err, db){
    function getPrincipal(callback){
        var query = {
    };

    db.collection("comments").find(query, {},{

    }
}