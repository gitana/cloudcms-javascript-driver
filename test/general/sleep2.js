var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('sleep_callback', function() {
    it('should sleep using callback without error', function(done) {

        CloudCMS.connect(function(err, session) {

            session.sleep(1000, function() {
                assert.isOk(true);
                done();
            });

        });

    });
});