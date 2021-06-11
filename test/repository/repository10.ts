import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('repository_1', function() {
    it('should run repository test without error', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();

        var branches = await session.queryBranches(repository);
        for (var i = 0; i < branches.rows.length; i++)
        {
            var branch = branches.rows[i];

            var nodes = await session.queryNodes(repository, branch, {}, {});
            for (var j = 0; j < nodes.rows.length; j++)
            {
                var node = nodes.rows[j];

                console.log("Repository: " + repository._doc + ", Branch: " + branch._doc + ", Node: " + node._doc);
            }
        }
    });
});