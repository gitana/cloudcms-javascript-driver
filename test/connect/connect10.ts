import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('connect10', function() {
    it('should connect using async/await without error', async function() {

        var session: CloudCMS.DefaultSession|null = null;
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