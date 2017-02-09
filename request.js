var async = require("async");
var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var token = 'EAACEdEose0cBAK57Jj91IrPzf0RbD4SOteYnb15IoEyqP0PwhO63xjAREdYRRtqHZAM5fGCy3Q6Lz8czjgyIdUZBTjfJFbce9DkZCD6WTFN4DS3lDx6zdTALvCGzIOTvBMsswwEZA9iojAb7FdBBQ5Ghd0SJjl0UXDXEaHl2DcWRxIUA7MYC'

async.waterfall([
    getID,
    getPosts,
    getComments
], function (err) {
    client.quit();
});

function getID(callback) {
    var page_id = ["115987058416365"];
    callback(null, page_id);
}

function getPaging(page_id, post_id, url, type, cb) {
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var update = JSON.parse(body)
            if (update[type]) {
                var obj = update[type].data
            } else {
                var obj = update.data
            }
            var list = [];
            async.forEach(obj, function (estadao, callback) {
                var id = estadao.id
                list.push(id)
                client.set(id, JSON.stringify(estadao))
                console.log(JSON.stringify(estadao))
                callback();
            })
            post_id = post_id.concat(list)
            if (update[type] && update[type].paging && update[type].paging.hasOwnProperty('next')) {
                var url = update[type].paging.next
                console.log("passou aqui!")
                getPaging(page_id, post_id, url, '', cb)
            }else if (update.paging && update.paging.hasOwnProperty('next')) {
                var url = update.paging.next
                console.log("Segunda passada")
                getPaging(page_id, post_id, url, '', cb)
            } else {
                console.log("chamou o else")
                return cb();
            }
        }
    })
}

function getPosts(page_id, callback) {
    async.forEach(page_id, function (id, cb) {
            var url = `https://graph.facebook.com/v2.8/${id}?fields=posts&access_token=${token}`;
            console.log("Post")
            getPaging(page_id, [], url, 'posts', cb)
        },
        function (err) {
            callback(null);
        })
}


function getComments(post_id, callback) {
    async.forEach(post_id, function (post, cb) {
            var url = `https://graph.facebook.com/v2.8/${post}?fields=comments&access_token=${token}`;
            console.log("Comentario")
            getPaging(post_id, [], url, 'comments', cb)
        }),
        function (err) {
            callback(null);
        }
}