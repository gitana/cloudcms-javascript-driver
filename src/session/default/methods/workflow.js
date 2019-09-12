module.exports = function(Session)
{
    class WorkflowSession extends Session
    {
        readWorkflow(workflowId)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/workflow/instances/" + workflowId, {}, callback);
        }

        queryWorkflows(query, pagination)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/workflow/instances/query", pagination, query, callback);
        }

        queryWorkflowTasks(query, pagination)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/workflow/tasks/query", pagination, query, callback);
        }
    }

    return WorkflowSession;
};