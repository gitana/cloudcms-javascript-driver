var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('repository_crudq', function() {
    it('should run CRUD + Query using a repository without error', async function() {

        var session = await CloudCMS.connect();

        var title = "repo-" + new Date().getTime();

        var repository1 = await session.platformService().createRepository({
            "title": title
        });
        assert.exists(repository1);

        var repositoryId = repository1._doc;

        // update
        var repository2 = await session.repositoryService(repositoryId).update(repository1);
        assert.exists(repository2);

        // query and verify there is 1 matching repository
        var response1 = await session.platformService().queryRepositories({
            "_doc": repositoryId
        });
        assert.equal(response1.rows.length, 1);

        // delete the repository
        await session.repositoryService(repositoryId).del();

        // query and verify there are 0 matching repositories
        var response2 = await session.platformService().queryRepositories({
            "_doc": repositoryId
        });
        assert.equal(response2.rows.length, 0);

    });
});