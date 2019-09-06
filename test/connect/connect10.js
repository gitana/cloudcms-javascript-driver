var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('connect_async_await_success', function() {
    it('should connect using async/await without error', async function() {

        var session = null;
        var err = null;
        try
        {
            session = await CloudCMS.connect();
        }
        catch (e)
        {
            err = e;
        }

        assert.notExists(err);
        assert.exists(session);

    });
});