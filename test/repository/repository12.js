var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('repository_crudq', function() {
    it('should run CRUD + Query using a repository without error', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();

        var branches = await session.queryBranches(repository);
        for (var i = 0; i < branches.rows.length; i++)
        {
            var branch = branches.rows[i];

            var nodes = await session.queryNodes(repository, branch, {}, {});

            session.queryNodes(repository, branch, )
        }
    });
});