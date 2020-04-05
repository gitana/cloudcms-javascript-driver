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

            return this.get("/projects/" + project, {}, callback);
        }
    }

    return ProjectSession;
};
