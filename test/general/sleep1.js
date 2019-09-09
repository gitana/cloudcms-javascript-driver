var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('sleep_await', function() {
    it('should sleep using async/await without error', async function() {

        var session = await CloudCMS.connect();

        await session.sleep(1000);

        assert.isOk(true);

    });
});