import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('node20', function() {
    it('should run node test without error using object bound functions', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();
        var branch = await repository.readBranch("master");

        var nodes = await session.queryNodes(repository, branch, {}, {});
        for (var j = 0; j < nodes.rows.length; j++)
        {
            var node = nodes.rows[j];

            console.log("Repository: " + repository._doc + ", Branch: " + branch + ", Node: " + node._doc);
        }
    });
});