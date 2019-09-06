var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('connect_callback_success', function() {
    it('should connect using a callback without error', function(done) {

        CloudCMS.connect(function(err, session) {

            assert.notExists(err);
            assert.exists(session);

            done();
        })
    });
});