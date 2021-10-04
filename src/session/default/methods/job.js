module.exports = function(Session)
{
    var Helper = require("../../../helper");

    class JobSession extends Session
    {
        readJob(job)
        {
            var jobId = this.acquireId(job);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/jobs/" + jobId, callback);
        }

        queryJobs(query, pagination)
        {
            var callback = this.extractOptionalCallback(arguments);
            return this.post("/jobs/query", pagination, query, callback);
        }

        killJob(job)
        {
            var jobId = this.acquireId(job);
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/jobs/" + jobId + "/kill", {}, {}, callback);
        }

    }

    return JobSession;
};