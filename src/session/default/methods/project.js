module.exports = function(Session)
{
    class ProjectSession extends Session
    {
        /**
         * Reads an Project.
         *
         * @param project
         * @returns {*}
         */
        readProject(project)
        {
            var projectId = this.acquireId(project);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/projects/" + projectId, {}, callback);
        }

        deleteProject(project)
        {
            var projectId = this.acquireId(project);
            var callback = this.extractOptionalCallback(arguments);

            return this.del("/projects/" + projectId, {}, callback);
        }

        updateProject(project)
        {
            var projectId = this.acquireId(project);
            var callback = this.extractOptionalCallback(arguments);

            return this.put("/projects/" + projectId, {}, project, callback);
        }

        queryProjects(query, pagination)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/projects/query", pagination, query, callback);
        }

        startCreateProject(object)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/projects/start", {}, object, callback);
        }

        listProjectTypes(pagination)
        {
            var callback = this.extractOptionalCallback(arguments)

            return this.get("/projecttypes", pagination, callback);
        }
    }

    return ProjectSession;
};
