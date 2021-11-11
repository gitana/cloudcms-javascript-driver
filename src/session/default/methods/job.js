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

        async waitForJobCompletion(job)
        {
            const jobId = this.acquireId(job);

            const _wait = async () => {
                job = await this.readJob(jobId);
                if (job.state === "FINISHED") {
                    return;
                }
                else if (job.state === "ERROR") {
                    throw new Error(`Job failed: ${jobId}`)
                }
                else {
                    await new Promise(r => setTimeout(r, 1000)); // wait a second
                    return _wait();            
                }
            }

            await _wait();

            // in 4.0, it might be better to hand back the job result which is a separate record
            return job;
        }

    }

    return JobSession;
};