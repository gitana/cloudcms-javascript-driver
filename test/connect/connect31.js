var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('connect31', function() {
    it('should fail to connect using a Promise and handle the error', function(done) {

        var f = function(callback)
        {
            CloudCMS.connect({
                "clientKey": "foo",
                "clientSecret": "bar",
                "username": "bah",
                "password": "bee",
                "baseURL": "http://localhost:8080"
            }).then(function(session) {
                callback(null, session);
            }, function(err) {
                callback(err);
            });
        };

        f(function(err, session) {

            assert.exists(err);
            assert.notExists(session);

            done();
        })
    });
});