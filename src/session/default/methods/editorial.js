module.exports = function(Session)
{
    class EditorialSession extends Session
    {
        startEditorialFlow(repository, rootBranch, operation, flowKey, properties, workflowData, swimlanesObject, nodeRefArray)
        {
            var repositoryId = this.acquireId(repository);
            var rootBranchId = this.acquireId(rootBranch);
            var callback = this.extractOptionalCallback(arguments);

            var query = {};

            var payload = {};
            payload.repositoryId = repositoryId;
            payload.branchId = rootBranchId;
            payload.operation = operation;
            payload.flowKey = flowKey;
            if (properties) {
                payload.properties = properties;
            }
            if (workflowData) {
                payload.workflowData = workflowData;
            }
            if (swimlanesObject) {
                payload.swimlanes = swimlanesObject;
            }
            if (nodeRefArray) {
                payload.nodeRefs = nodeRefArray;
            }

            return this.post("/editorial/flows/start", query, payload, callback);
        }

        readCurrentTaskForEditorialFlow(workflowId)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/editorial/flows/" + workflowId + "/task", {}, callback);
        }

        transitionEditorialFlow(workflowId, route)
        {
            var callback = this.extractOptionalCallback(arguments);

            var query = {
                "route": route
            };

            return this.post("/editorial/flows/" + workflowId + "/transition", query, callback);
        }
    }

    return EditorialSession;
};