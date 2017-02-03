var url = "https://graph.facebook.com/v2.8/115987058416365_1508246135857110?fields=comments&access_token=EAACEdEose0cBALOFEboXB2D9ZACqGvu3YJfhdff5hO46BZAyRPHUvJEURkZAuZAbTFjXxv6Lypequ1rGZBM9LeQXZB2lZAGzhwarlkgkNHU8bentPSbHVeaii25vKUkC4RbXzAes8FKsmNPaG5ZCG9fmJ6Jpom9FrVnOYGoRkPmgk310e9w9NsjU"

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
                console.log("rodou aqui01")
                //update.comments.data[0].message = "Eu estive aqui"
                var page_id = "115987058416365"
                var post_id = "1508246135857110"
                for (red in update.comments.data) {
                    var estadao_comments = update.comments.data[red]
                    var id = update.comments.data[red].id
                    estadao_comments.page_id = page_id
                    estadao_comments.page_id.post_id = post_id
                    client.set(id, JSON.stringify(estadao_comments))
                }
            } else {
                console.log("rodou aqui02")
                //update.data[0].message = "Eu estive aqui"
                var page_id = "115987058416365"
                var post_id = "1508246135857110"
                async.each(update.data, function (red, callback) {
                        var id = red.id
                        red.page_id = page_id
                        red.page_id.post_id = post_id
                        client.set(id, JSON.stringify(red))
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
        }
    })
}
}


req(url)