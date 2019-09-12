var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('custom_session_3', function() {
    it('should run sample method using callback without error', function(done) {

        // use a custom session
        // this has the test() method
        var customSession = require("./custom-session");
        CloudCMS.session(customSession);

        // connect
        CloudCMS.connect(function(err, session) {

            session.test(function(err, count) {

                assert.equal(count, 101);
                done();

            });
        });
    });
});