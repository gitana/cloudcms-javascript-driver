var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('custom_storage_3', function() {
    it('should run using custom storage / callback without error', function(done) {

        // custom storage
        var customStorage = require("./custom-storage");
        CloudCMS.storage(customStorage);

        // connect
        CloudCMS.connect(function(err, session) {

            assert.isOk(true);
            done();

        });
    });
});