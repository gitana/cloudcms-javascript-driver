var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('node10', function() {
    it('should run node test without error', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();
        var branchId = "master";

        var nodes = await session.queryNodes(repository, branchId, {}, {});
        for (var j = 0; j < nodes.rows.length; j++)
        {
            var node = nodes.rows[j];

            console.log("Repository: " + repository._doc + ", Branch: " + branchId + ", Node: " + node._doc);
        }
    });
});