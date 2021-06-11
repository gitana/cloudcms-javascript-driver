import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('node14', function() {
    it('should run node test without error', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();
        var branchId = "master";

        // build out hierarchy
        var createNodeResult1 = await session.createNode(repository, branchId, { "title": "node1"});
        var nodeId = createNodeResult1._doc;

        // add a feature
        await session.addNodeFeature(repository, branchId, nodeId, "f:filename", { "filename": "woo" });
        await sleep(500);

        var node = await session.readNode(repository, branchId, nodeId);

        // verify it has the right "f:filename"
        var filename = node._features["f:filename"].filename;
        assert.equal(filename, "woo");

    });
});

var sleep = function(ms)
{
    return new Promise<void>(function(resolve, reject) {

        setTimeout(function() {
            resolve();
        }, ms);
    });
};