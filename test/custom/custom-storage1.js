var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('custom_storage_1', function() {
    it('should run using custom storage / await without error', async function() {

        // custom storage
        var customStorage = require("./custom-storage");
        CloudCMS.storage(customStorage);

        // connect
        var session = await CloudCMS.connect();

        // TODO: something

        assert.isOk(true);
    });
});