var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('branch_1', function() {
    it('should test branch methods in a repository without error', async function() {

        var session = await CloudCMS.connect();
        var repository = await session.createRepository();

        // list branches
        var branches = await session.listBranches(repository);

        for (var i = 0; i < branches.rows.length; i++)
        {
            var branch = branches.rows[i];
            console.log("Repository: " + repository._doc + ", Branch: " + branch._doc + ", Title: " + branch.title);
        }

        // read master branch
        var master = await session.readBranch(repository, "master");

        // create branch
        var newBranch = await session.createBranch(repository, master, master.tip, {title: "new branch 1"});
        console.log("Repository: " + repository._doc + ", Branch: " + newBranch._doc + ", Title: " + newBranch.title);

        // read non master branch
        newBranch = await session.readBranch(repository, newBranch);
        console.log("Repository: " + repository._doc + ", Branch: " + newBranch._doc + ", Title: " + newBranch.title);

    });
});