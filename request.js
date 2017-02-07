var async = require("async");
var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var token = 'EAACEdEose0cBALUgBlSZCroexOVh7QTFMwYVZCoZBw3LHhBIiiA6DNZCEmi2hbG7vZBZBvsj7SMxbb9MkOlZAdUbZCcrXPCs2pceYX1punCP8ngCGlGaNDOhJ9M2KVjHZCdQlz1aLfHAY9SiZCNzIXN7NGrmElyX3ghvfyMAXB7ZCIZAhleZAIfH8MwlJ'

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
        var update = JSON.parse(body)
        if (update.hasOwnProperty('posts')) {
            var posts = update.posts.data
        } else {
            var posts = update.data
        }
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
        }if (!update.hasOwnProperty('posts')) {
            console.log("passou AQUI!!!!!")
            var url = update.paging.next
            getPaging(ids, url, cb)
        }else{
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