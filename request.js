var async = require("async");
var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var token = 'EAACEdEose0cBABRpSCuBpywV4ufxRU8d1CuZCASIl5JSZCGHgtCkvdLAF1J4nnV9sGUWRjQYVfn2XGiJutihbrhoxPD10Olap6WLWrcyjdueYbcRxTopspCebsafJuWSjdJQclq7ZBceUBgTvW8DXq5sMQTTRSUU51Uo94UENGZAr2mYZAQPc'

async.waterfall([
    getID,
    getPosts
], function (err) {
    client.quit();
});

function getID(callback) {
    var page_id = ["115987058416365"];
    callback(null, page_id);
}

function getPaging(page_id, url, type, cb) {
    request.get(url, function (error, response, body) {
        var update = JSON.parse(body)
        if (update[type]) {
            var obj = update[type].data
        } else {
            var obj = update.data
        }
        async.forEach(obj, function (estadao, callback) {
            var id = estadao.id
            client.set(id, JSON.stringify(estadao))
            console.log(JSON.stringify(estadao))
            callback();
        })
        if (update[type] && update[type].paging && update[type].paging.hasOwnProperty('next')) {
            var url = update[type].paging.next
            getPaging(page_id, url, '', cb)
        } else if (update.paging && update.paging.hasOwnProperty('next')) {
            var url = update.paging.next
            getPaging(page_id, url, '', cb)
        } else {
            cb();
        }
    })
}




function getPosts(page_id, callback) {
    async.forEach(page_id, function (id, cb) {
            var url = `https://graph.facebook.com/v2.8/${id}?fields=posts&access_token=${token}`;
            //console.log(url)
            //console.log("Post")
            getPaging(page_id, url, 'posts', cb)
        }),
        function (err) {
            callback(null);
        }
}


function getComments(post_id, callback) {
    async.forEach(post_id, function (post, cb) {
            var url = `https://graph.facebook.com/v2.8/${post}?fields=comments&access_token=${token}`;
            //console.log(url)
            //console.log("Comentario")
            getPaging(post_id, url, 'comments', cb)
        },
        function (err) {
            callback(null);
        })
}