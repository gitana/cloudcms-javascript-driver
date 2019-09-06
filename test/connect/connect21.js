var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('connect_callback_error', function() {
    it('should fail to connect using a callback and handle the error', function(done) {

        CloudCMS.connect({
            "clientKey": "foo",
            "clientSecret": "bar",
            "username": "bah",
            "password": "bee",
            "baseURL": "http://localhost:8080"
        }, function(err, session) {

            assert.exists(err);
            assert.notExists(session);

            done();
        })
    });
});