var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('custom_storage_2', function() {
    it('should run using custom storage / promise without error', function(done) {

        // custom storage
        var customStorage = require("./custom-storage");
        CloudCMS.storage(customStorage);

        // connect
        CloudCMS.connect().then(function(session) {

            assert.isOk(true);
            done();

        });
    });
});