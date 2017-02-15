var url = "https://graph.facebook.com/v2.8/115987058416365_1508246135857110?fields=likes&access_token=EAACEdEose0cBAPTrAdq4Ay4q0kLrKM5Id7FZAZASOzGziTRIbvs5k9ZAvw6aTuhG4PJekJTIyrL5ZAqRLpI9olKb5SxoFvhNZBZCKuQWo5qpXZB7LNqa6TIDZCLw0lISr9TNSQWuZCfB0AZA6V1OzKPZBSYIZBr69T4aZCt5GBrXFoV6bqtADdkZBpG2MP"

var async = require("async");
var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var token = 'EAACEdEose0cBALwtfKD6vpZA51ZC0qlRZBmLqBdYcmBrLk3zIKiabJI2eiczsMA1ho8sTzTNSpToov32GsaKpdiaNQSXYXU2kHV2jABcXvoW8vFPoIX1IYSypgjviwrB29AzNYVOW45ZA0CnW3gciiFwuRK7iIY1gCDZCfZBIAFJBz9CyXWDxk'

//Função que faz a requisição da de uma API(por meio da URL dada) e retorna uma string para o salvar no redis

async.waterfall([
    GetID,
    GetLikes
], function (err) {
    client.quit();
});

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

function GetLikes(ids, callback) {
    async.forEach(ids, function (id, cb) {
        var url = `https://graph.facebook.com/v2.8/${id}?fields=likes&access_token=${token}`;
        console.log(url)
        request.get(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var update = JSON.parse(body)
                if (update.hasOwnProperty('likes')) {
                    var likes = update.likes.data
                } else {
                    var likes = update.data
                }
                async.forEach(likes, function (estadao, callback) {
                    var id = estadao.id
                    console.log(JSON.stringify(estadao))
                    client.set(id, JSON.stringify(estadao))
                    callback();
                })
            }
            cb();
        })
    }, function (err) {
        callback();
    })
}


function GetPaging(arg1, callback) {
    // arg1 now equals 'three'
    callback(null, 'done');
}