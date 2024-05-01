import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('connect40', function() {
    it('should connect using async/await and the node-fetch engine without error', async function() {

        var session: CloudCMS.DefaultSession|null = null;
        var err = null;
        try
        {
            // select the "fetch" engine
            CloudCMS.engine("fetch");

            session = await CloudCMS.connect();
        }
        catch (e)
        {
            err = e;
        }
        finally
        {
            // reset
            CloudCMS.engine(null);
        }

        assert.notExists(err);
        assert.exists(session);

    });
});