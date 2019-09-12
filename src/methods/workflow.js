var Extensions = require("../extensions");

var extendFn = function(Session, Helper)
{
    class c extends Session {

        constructor(config, driver, storage)
        {
            super(config, driver, storage)
        }

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

    return c;
};

Extensions.session("workflow", extendFn, { "core": true });
