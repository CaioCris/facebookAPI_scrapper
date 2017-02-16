var async = require("async");
var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var token = '1360294374002068|sRfrwTeLo4OCM5ksDyBkhrFUL_0'

var post_id = [];
var comment_id = [];

async.waterfall([
    getID,
    getPosts,
    
], function (err) {
    client.quit();
});

function getID(callback) {
    var page_id = ["316449433298"];
    callback(null, page_id);
}

function getPaging(page_id, url, type, cb) {
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var update = JSON.parse(body)
            if (update[type]) {
                var obj = update[type].data
            } else {
                var obj = update.data
            }
            var list = [];
            async.forEach(obj, function (object, callback) {
                var id = object.id
                var chave = `fb:${type}:${object.id}`;
                list.push(id)
                client.set(chave, JSON.stringify(object))
                callback();
            })
            if (type == 'posts') {
                post_id = post_id.concat(list)
            } else {
                comment_id = comment_id.concat(list)
            }
            if (update[type] && update[type].paging && update[type].paging.hasOwnProperty('next')) {
                var url = update[type].paging.next
                console.log("passou aqui!", type)
                getPaging(page_id, url, type, cb)
            } else if (update.paging && update.paging.hasOwnProperty('next')) {
                var url = update.paging.next
                console.log("Segunda passada", type)
                getPaging(page_id, url, type, cb)
            } else {
                console.log("chamou o else", type)
                return cb();
            }
        }
    })
}

function getPosts(page_id, callback) {
    async.forEach(page_id, function (id, cb) {
            var url = `https://graph.facebook.com/v2.8/${id}?fields=posts&access_token=${token}`;
            console.log("Post")
            getPaging(page_id, url, 'posts', cb)
        },
        function (err) {
            callback(null, post_id);
        });
}

function getComments(post_id, callback) {
    async.forEachLimit(post_id, 100, function (post, cb) {
            var url = `https://graph.facebook.com/v2.8/${post}?fields=comments{like_count,comment_count,message,from,created_time}&access_token=${token}`;
            console.log("Comentario")
            getPaging('', url, 'comments', cb)
        },
        function (err) {
            callback(null, comment_id);
        });
}

function getThreads(comment_id, callback) {
    async.forEachLimit(comment_id, 100, function (comment, cb) {
            var url = `https://graph.facebook.com/v2.8/${comment}?fields=comments{like_count,comment_count,message,from,created_time}&access_token=${token}`;
            console.log("Thread")
            getPaging('', url, 'comments', cb)
        },
        function (err) {
            callback(null);
        });
}
