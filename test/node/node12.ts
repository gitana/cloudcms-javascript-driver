import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('node12', function() {
    it('should run node test without error', function(done) {

        (async function() {

            var session = await CloudCMS.connect();

            var repository = await session.createRepository();
            var branchId = "master";

            // build out hierarchy
            var node = await session.createNode(repository, branchId, { "title": "node1"});

            // add a feature
            await session.addNodeFeature(repository, branchId, node, "f:filename", { "filename": "woo" });

            // read the node back
            setTimeout(async function() {
                console.log("m1");
                var node2 = await session.readNode(repository, branchId, node._doc);

                // verify it has the right "f:filename"
                var filename = node2._features["f:filename"].filename;
                assert.equal("woo", filename);
                console.log("m2: " + filename);

                done();
            }, 3000);

        })();
    });
});