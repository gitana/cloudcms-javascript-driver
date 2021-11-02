import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('node23', function() {
    it('should run node test without error using object bound functions', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();
        var branch = await repository.readBranch("master");

        // build out hierarchy
        var node1 = await branch.createNode({ "title": "node1"});
        var nodeId = node1._doc;

        // add a feature
        await node1.addNodeFeature("f:filename", { "filename": "woo" });
        await sleep(500);

        var node = await branch.readNode(nodeId);

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