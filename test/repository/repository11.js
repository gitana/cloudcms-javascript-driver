var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('repository_crudq', function() {
    it('should run CRUD + Query using a repository without error', async function() {

        var session = await CloudCMS.connect();
        var platformMethods = session.platformMethods();

        var repository = await platformMethods.createRepository();

        //var repository2 = await session.platformService().updateRepository(repository);
        //await session.platformService().deleteRepository(repository);

        var repositoryMethods = session.repositoryMethods(repository);

        var branches = await repositoryMethods.queryBranches();
        for (var i = 0; i < branches.rows.length; i++)
        {
            var branch = branches.rows[i];

            await repositoryMethods.updateBranch(branch);
            await repositoryMethods.deleteBranch(branch);
        }

        var branch = {};

        var branchMethods = session.branchMethods(repository, branch);

        var nodes = await branchMethods.queryNodes();
    });
});