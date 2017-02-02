var url = "https://graph.facebook.com/v2.8/115987058416365?fields=posts&access_token=EAACEdEose0cBANl02xmbsFl9NkPqrA7T8F7U1Jxd6XQGouqe8g3dxVXD9tApLoU5lzuD4JBLzZCABLKwG0ZCaSMHSLLX2X9vlYaEp3bOjVcTR65J6pZBVs3TsIbB1zvzkL6boZCA34LXMlA05eXjensG8wXBdP8eIB7fZCZB34XnVxkF3AdY9P"

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
        //console.log(update)
        if (update.posts) {
          console.log("rodou aqui01")
          update.posts.data[0].message = "Eu estive aqui"
          for (red in update.posts.data) {
            var estadao_item = update.posts.data[red]
            var id = update.posts.data[red].id
            client.set(id, JSON.stringify(estadao_item))
          }
        } else {
          console.log("rodou aqui02")
          update.data[0].message = "Eu estive aqui"
          async.each(update.data, function (red, callback) {
              var id = red.id
              client.set(id, JSON.stringify(red))
              callback();
            }),
            function (err) {
              client.quit();
            }
        }
        if (update.posts) {
          req(update.posts.paging.next)
        } else {
          req(update.paging.next)
        }
      }
    })
  }
}


req(url)

/*function req(url) {
  if (typeof url !== "undefined") {
    console.log(url)
    request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var update = JSON.parse(body)
        //console.log(update)
        if (update.posts) {
          console.log("rodou aqui01")
          update.posts.data[0].message = "Eu estive aqui"
          for (red in update.posts.data) {
            var estadao_item = update.posts.data[red]
            var id = update.posts.data[red].id
            client.set(id, JSON.stringify(estadao_item))
          }
        } else {
          console.log("rodou aqui02")
          update.data[0].message = "Eu estive aqui"
          for (red in update.data) {
            var estadao_item = update.data[red]
            var id = update.data[red].id
            client.set(id, JSON.stringify(estadao_item))
          }
        }
        if (update.posts) {
        req(update.posts.paging.next)
        } else {
        req(update.paging.next)
        }
      }
    })
  }
}*/