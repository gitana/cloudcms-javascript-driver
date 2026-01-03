import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('release10', function() {
    it('should run release test without error', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();
        
        // Create release
        let createJob1:any = await session.startCreateRelease(repository, { title: 'Test' });
        createJob1 = await session.pollForJobCompletion(createJob1);
        const releaseId1 = createJob1._result["created-release-id"];

        let release = await session.readRelease(repository, releaseId1);
        assert.isNotNull(release);
        release.title = "tasty";
        await session.updateRelease(repository, release._doc, release);
    
        let list = await session.listReleases(repository);
        assert.isAbove(list.rows.length, 0);

        let query = await session.queryReleases(repository, {});
        assert.isAbove(query.rows.length, 0);

        // Delete release
        await session.deleteRelease(repository, releaseId1);

    });
});