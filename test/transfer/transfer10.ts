import * as CloudCMS from "../..";
var assert = require('chai').assert;
var fs = require("fs");
var path = require("path");

describe('transfer10', function () {
    it('should run transfer test without error', async function () {
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

            var branchId = "master";
            var node1Id = (await session.createNode(repository, branchId, { title: "a novel node" }))._doc;
            var node1 = await session.readNode(repository, branchId, node1Id);

            // Construct a project reference
            var ref = `project://${platform._doc}/${project._doc}`;


            var exportOpts: CloudCMS.TransferExportOpts = {
                group: "test",
                artifact: "test",
                version: now,
                title: `test-${now}`,
                published: true
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


            var exportJob = await session.exportArchive(ref, exportOpts, exportConfig);
            await session.waitForJobCompletion(exportJob);

            var archive = await session.lookupArchive("test", "test", now);
            assert.isNotNull(archive);

            var projectTypes = await session.listProjectTypes();
            var projectType = projectTypes.rows.find(item => item.identifier === `test-test-${now}`);
            assert.isNotNull(projectType);

            var startResult2 = await session.startCreateProject({
                title: `test2-${now}`,
                projectType: projectType?.reference
            });
            var projectJob2 = await session.waitForJobCompletion(startResult2._doc);
            var project2Id = projectJob2["created-project-id"];
            var project2 = await session.readProject(project2Id);
            var repository2 = await session.readDataStore(project2.stackId, "content");
            
            var node2 = await session.queryOneNode(repository2, branchId, { title : "a novel node" });
            assert.equal(node2?.title, node1.title);

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