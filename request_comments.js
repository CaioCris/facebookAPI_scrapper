var url = "https://graph.facebook.com/v2.8/115987058416365_1508246135857110?fields=comments&access_token=EAACEdEose0cBAPTrAdq4Ay4q0kLrKM5Id7FZAZASOzGziTRIbvs5k9ZAvw6aTuhG4PJekJTIyrL5ZAqRLpI9olKb5SxoFvhNZBZCKuQWo5qpXZB7LNqa6TIDZCLw0lISr9TNSQWuZCfB0AZA6V1OzKPZBSYIZBr69T4aZCt5GBrXFoV6bqtADdkZBpG2MP"

var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var async = require("async");

//Função que faz a requisição da de uma API(por meio da URL dada) e retorna uma string para o salvar no redis
function req(url) {
    if (typeof url !== "undefined") {
        console.log(url)
        request.get(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var update = JSON.parse(body)
                if (update.comments) {
                    var comments = update.comments.data
                } else {
                    var comments = update.data
                }
                async.each(comments, function (estadao, callback) {
                        var id = estadao.id
                        var page_id = "115987058416365"
                        var post_id = "1508246135857110"
                        estadao.page_id = page_id
                        estadao.post_id = post_id
                        console.log(JSON.stringify(estadao))
                        client.set(id, JSON.stringify(estadao))
                        callback();
                    }),
                    function (err) {
                        client.quit();
                    }
            }
            if (update.comments) {
                req(update.comments.paging.next)
            } else {
                req(update.paging.next)
            }
        })
    }
}

req(url)