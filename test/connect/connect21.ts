import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('connect21', function() {
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