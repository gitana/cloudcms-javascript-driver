import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('sleep3', function() {
    it('should sleep using promise without error', function(done) {

        CloudCMS.connect().then(function(session) {

            session.sleep(1000).then(function() {
                assert.isOk(true);
                done();
            });
        });

    });
});