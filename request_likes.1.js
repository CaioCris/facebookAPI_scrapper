var async = require("async");
var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var token = '1360294374002068|sRfrwTeLo4OCM5ksDyBkhrFUL_0'

var post_id = [];
var comment_id = [];
var like_id = [];

async.waterfall([
    getID,
    getLikes
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
                var obj = update[type].data[0].id
            } else {
                var obj = update.data[0].likes
            }
            console.log(update)
            console.log(obj)
            process.exit()
            var list = [];
            async.forEach(obj, function (object, callback) {
                var id = object.id
                var chave = `fb:${type} +"_likes":${object.id}`;
                list.push(id)
                client.set(chave, JSON.stringify(object))
                //console.log(JSON.stringify(object))
                callback();
            })
            if (type == 'posts') {
                post_id = post_id.concat(list)
            } else if (type == 'comments'){
                comment_id = comment_id.concat(list)
            }else{
                like_id = like_id.concat(list)
            }
            console.log(like_id)
            if (update[type] && update[type].paging && update[type].paging.hasOwnProperty('next')) {
                var url = update[type].paging.next
                console.log("passou aqui!")
                getPaging(page_id, url, type, cb)
            } else if (update.paging && update.paging.hasOwnProperty('next')) {
                var url = update.paging.next
                console.log("Segunda passada")
                getPaging(page_id, url, type, cb)
            } else {
                console.log("chamou o else")
                return cb();
            }
        }
    })
}


function getLikes(page_id, callback) {
    async.forEach(page_id,function (id, cb) {
            var url = `https://graph.facebook.com/v2.8/${id}?fields=posts%7Blikes%7D&access_token=${token}`;
            console.log("Likes")
            getPaging(page_id, url, 'posts', cb)
        },
        function (err) {
            callback(null, post_id);
        })
}