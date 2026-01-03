import * as CloudCMS from "../..";

var assert = require('chai').assert;

describe('editorial_1', function() {
    it('should test editorials methods in a repository without error', async function() {

        var session = await CloudCMS.connect();

        // create a project
        var createProjectJob:any = await session.startCreateProject({
            "title": "test project " + new Date().getTime()
        });
        createProjectJob = await session.pollForJobCompletion(createProjectJob);
        var projectId = createProjectJob._result["created-project-id"];
        var project = await session.readProject(projectId);

        // find the project repository
        var repository:CloudCMS.Repository = await session.readDataStore(project.stackId, "content");

        // start a new editorial flow
        var rootBranchId = "master";
        var operation = "edit";
        var flowKey = "default";
        var properties = {
            "title": "My Flow 1"
        };
        var workflowData = {};
        var swimlanesObject = {};
        var nodeRefArray = [];
        var result:any = await session.startEditorialFlow(repository, rootBranchId, operation, flowKey, properties, workflowData, swimlanesObject, nodeRefArray)

        var workflowId = result.workflowId;
        var branchId = result.branchId;
        var workspaceId = result.workspaceId;
        //var workflowTaskIds = result.workflowTaskIds;

        // read the task for the current user
        var currentTask:any = await session.readCurrentTaskForEditorialFlow(workflowId);
        //console.log("Current Task: " + JSON.stringify(currentTask));
        assert.isNotNull(currentTask);
        var routes = currentTask.routes; // "cancel" and "finish"
        assert.isNotNull(routes);
        assert.equal(2, Object.keys(routes).length);

        // create three nodes on the flow branch
        await session.createNode(repository, branchId, { "title": "n1", "foo": "bar"});
        await session.createNode(repository, branchId, { "title": "n2", "foo": "bar"});
        await session.createNode(repository, branchId, { "title": "n3", "foo": "bar"});

        // ensure 0 matches on master
        var results1 = await session.queryNodes(repository, "master", { "foo": "bar" })
        assert.equal(0, results1.rows.length);

        // finish the flow (this commits back to master branch)
        var nextTask = await session.transitionEditorialFlow(workflowId, "finish");
        assert.isNotNull(nextTask);
        //console.log("Next Task: " + JSON.stringify(nextTask, null, 2));

        // wait for things to finish (merge, publish)
        await session.sleep(5000);

        // now verify the nodes are on master
        var results2 = await session.queryNodes(repository, "master", { "foo": "bar" })
        assert.equal(3, results2.rows.length);
    });
});