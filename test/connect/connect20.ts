import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('connect20', function() {
    it('should connect using a callback without error', function(done) {

        CloudCMS.connect(function(err, session) {

            assert.notExists(err);
            assert.exists(session);

            done();
        })
    });
});