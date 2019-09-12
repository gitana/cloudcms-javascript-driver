var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('custom_session_2', function() {
    it('should run sample method using promise without error', function(done) {

        // use a custom session
        // this has the test() method
        var customSession = require("./custom-session");
        CloudCMS.session(customSession);

        // connect
        CloudCMS.connect().then(function(session) {

            session.test().then(function(count) {

                assert.equal(count, 101);
                done();

            });
        });
    });
});