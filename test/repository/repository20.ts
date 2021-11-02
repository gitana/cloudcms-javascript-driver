import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('repository_2', function() {
    it('should run repository test without error using object bound functions', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();

        var branches = await repository.queryBranches();
        for (var i = 0; i < branches.rows.length; i++)
        {
            var branch = branches.rows[i];

            var nodes = await branch.queryNodes({}, {});
            for (var j = 0; j < nodes.rows.length; j++)
            {
                var node = nodes.rows[j];

                console.log("Repository: " + repository._doc + ", Branch: " + branch._doc + ", Node: " + node._doc);
            }
        }
    });
});