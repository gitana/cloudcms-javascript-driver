var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('sleep_promise', function() {
    it('should sleep using promise without error', function(done) {

        CloudCMS.connect().then(function(session) {

            session.sleep(1000).then(function() {
                assert.isOk(true);
                done();
            });
        });

    });
});