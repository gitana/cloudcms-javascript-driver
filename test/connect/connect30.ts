import * as CloudCMS from "../.."
var assert = require('chai').assert;

describe('connect30', function() {
    it('should connect using a Promise without error', function(done) {

        var f = function(callback)
        {
            CloudCMS.connect().then(function(session) {
                callback(null, session);
            }, function(err) {
                callback(err);
            });
        };

        f(function(err, session) {

            assert.notExists(err);
            assert.exists(session);

            done();
        })
    });
});