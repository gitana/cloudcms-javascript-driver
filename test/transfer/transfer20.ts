import * as CloudCMS from "../..";
var assert = require('chai').assert;
var fs = require("fs");
var path = require("path");

describe('transfer20', function () {
    it('should run transfer test 2 without error', async function () {
        try
        {
            var session = await CloudCMS.connect();
            var platform = await session.readPlatform();

            var now = `${Date.now()}`;
            var startResult = await session.startCreateProject({title: `test-${now}`});
            var projectJob = await session.waitForJobCompletion(startResult._doc);
            var projectId = projectJob["created-project-id"];
            var project = await session.readProject(projectId);
            var repository = await session.readDataStore(project.stackId, "content");

            var master = await session.readBranch(repository, "master");
            var branchId1 = master._doc;
            var node1Id = (await session.createNode(repository, branchId1, { title: "a novel node" }))._doc;
            var node1 = await session.readNode(repository, branchId1, node1Id);


            var exportOpts: CloudCMS.TransferExportOpts = {
                group: "test",
                artifact: "test",
                version: now,
                title: `test-${now}`,
            };
            
            var exportConfig: CloudCMS.TransferExportConfiguration = {
                "tipChangesetOnly": true,
                "includeACLs": true,
                "includeTeams": true,
                "includeTeamMembers": true,
                "includeRoles": true,
                "includeActivities": false,
                "includeBinaries": true,
                "includeAttachments": true
            };




            var exportJob = await session.exportNodes(repository, branchId1, node1, exportOpts, exportConfig);
            await session.waitForJobCompletion(exportJob);

            var archive = await session.lookupArchive("test", "test", now);
            assert.isNotNull(archive);

            var startResult2 = await session.startCreateProject({
                title: `test2-${now}`,
            });
            var projectJob2 = await session.waitForJobCompletion(startResult2._doc);
            var project2Id = projectJob2["created-project-id"];
            var project2 = await session.readProject(project2Id);
            var repository2 = await session.readDataStore(project2.stackId, "content");

            
            var importOpts: CloudCMS.TransferImportOpts = exportOpts;
            
            var master2 = await session.readBranch(repository2, "master");
            var branchId2 = master2._doc;
            var importJob = await session.importArchiveToBranch(repository2, branchId2, importOpts, { "strategy": "CLONE"});
            await session.waitForJobCompletion(importJob);

            var copiedNode = await session.readNode(repository2, branchId2, node1Id);
            assert.isNotNull(copiedNode);


            await Promise.all([
                session.deleteArchive(archive),
                session.deleteProject(project),
                session.deleteProject(project2)
            ]);
        }
        catch (err: any)
        {
            console.error(err);
            throw err;
        }
    });
});