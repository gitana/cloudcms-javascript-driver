var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('connect_async_await_error', function() {
    it('should fail to connect using async/await and handle the error', async function() {

        var session = null;
        var err = null;
        try
        {
            session = await CloudCMS.connect({
                "clientKey": "foo",
                "clientSecret": "bar",
                "username": "bah",
                "password": "bee",
                "baseURL": "http://localhost:8080"
            });
        }
        catch (e)
        {
            err = e;
        }

        assert.exists(err);
        assert.notExists(session);

    });
});