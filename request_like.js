var url = "https://graph.facebook.com/v2.8/115987058416365_1508246135857110?fields=likes&access_token=EAACEdEose0cBANJG6dZBTPpoW8118mBXf7hVTNWXCMl67xyHKcyxDnrgQxoRcF7R8fFAQNr1KlkxpbPbfkyj4hlRFMF2xZBq1Q4UZCRLbcnqcfswZBJDHKkFI3nFiC831nZCGdQvhNFIYdfToegx5IRPr6S8PsmP8G5gEYjguZAlhyZCf7FpVOO"

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
            if (update.likes) {
                console.log("rodou aqui01")
                update.likes.data[0].name = "Eu estive aqui"
                var parent_id = "115987058416365_1508246135857110"
                for (red in update.likes.data) {
                    var estadao_likes = update.likes.data[red]
                    var id = update.likes.data[red].id
                    estadao_likes.parent_id = parent_id
                    client.set(id, JSON.stringify(estadao_likes))
                }
            } else {
                console.log("rodou aqui02")
                update.data[0].name = "Eu estive aqui"
                var parent_id = "115987058416365_1508246135857110"
                async.each(update.data, function (red, callback) {
                        var id = red.id
                        red.parent_id = parent_id
                        client.set(id, JSON.stringify(red))
                        callback();
                    }),
                    function (err) {
                        client.quit();
                    }
            }
            if (update.likes) {
                req(update.likes.paging.next)
            } else {
                req(update.paging.next)
            }
        }
    })
}
}


req(url)