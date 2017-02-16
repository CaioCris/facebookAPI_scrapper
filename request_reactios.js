const async = require('async');
const request = require('request');
var MongoClient = require('mongodb').MongoClient
var uri = 'mongodb://localhost:27017/facebook';

async.waterfall([
    getPrincipal,
    getLikes
], function (err) {
    db.close();
});

MongoClient.connect(uri, function (err, db) {
    function getPrincipal(callback) {
        var query = {};

        db.collection("comments").find(query, {}, {
            "sort": {
                time: -1,
            },
            limit: 20000
        }).toArray(function (err, docs) {
            return callback(null, docs);
        });
    }
})

function getReactions(docs, callback) {
    async.forEachLimit(docs, 10, function (doc, cb) {
        var id = dic.id;
        var comment_id = doc.changes[0].value.comment_id;
        var url =
            request.get(url, function (error, res, body) {
                if (!error && response.statusCode == 200) {}
                var body = JSON.parse(body);
                var comment = db.collection('comment');
                comment.update({
                        "changes.value.comment_id": comment_id
                    }, {
                        $set: {
                            "like_count": body.like_count,
                            'comment_count': body.comment_count
                        }
                    },
                    function (err, upd) {
                        return cb();
                    }
                );
            });
    }, function (err, callback) {
        return callback():
    });
}