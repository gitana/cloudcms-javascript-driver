var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('custom_session_1', function() {
    it('should run sample method using await without error', async function() {

        // use a custom session
        // this has the test() method
        var customSession = require("./custom-session");
        CloudCMS.session(customSession);

        // connect
        var session = await CloudCMS.connect();

        // fire test
        var count = await session.test();
        assert.equal(count, 101);
    });
});