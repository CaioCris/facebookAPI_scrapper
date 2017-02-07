var async = require("async");
var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var token = 'EAACEdEose0cBABnuQgZC8l6z1VIjtIp49inb061HYKCNLaIzbJZBlLfh3gGsozppadX5RV0adAdgoA05WtNUUyUH6mxX3a3iROYZBLUYHyKyhZCAvsdsCZCr7wrXbOVwfTUqkyBtR3P5FypQNO4SUid2ulSejWW5bCdJSZBvpGAFCtPgzi9Vs2'

async.waterfall([
    getID,
    getPosts
], function (err) {
    client.quit();
});

function getID(callback) {
    var ids = ["115987058416365"];
    console.log(ids)
    callback(null, ids);
}

function getPaging(ids, url, cb) {
    request.get(url, function (error, response, body) {
        console.log("passou aqui")
        var update = JSON.parse(body)
        if (update.hasOwnProperty('posts')) {
            var posts = update.posts.data
        } else {
            var posts = update.data
        }
        console.log("chegou aqui")
        async.forEach(posts, function (estadao, callback) {
            var id = estadao.id
            console.log(JSON.stringify(estadao))
            client.set(id, JSON.stringify(estadao))
            callback();
        })
        if (update.hasOwnProperty('posts')) {
            var url = update.posts.paging.next
            console.log("AQUI")
            getPaging(ids, url, cb)
        } if (typeof url !== "undefined" && !update.hasOwnProperty('posts')){
            console.log("passou AQUI!!!!!")
            var url = update.paging.next
            getPaging(ids, url, cb)
        } else {
            cb();
        }

    })
}


function getPosts(ids, callback) {
    async.forEach(ids, function (id, cb) {
            var url = `https://graph.facebook.com/v2.8/${id}?fields=posts&access_token=${token}`;
            console.log(url)
            getPaging(ids, url, cb)
        }),
        function (err) {
            callback(null);
        }
}