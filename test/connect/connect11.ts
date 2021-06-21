import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('connect11', function() {
    it('should fail to connect using async/await and handle the error', async function() {

        var session: CloudCMS.DefaultSession|null = null;
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