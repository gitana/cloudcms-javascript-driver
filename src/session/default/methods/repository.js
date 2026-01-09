module.exports = function(Session)
{
    class RepositorySession extends Session
    {
        /**
         * Create a repository.
         *
         * @param obj
         * @returns object
         */
        createRepository(obj)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/repositories", {}, obj, callback);
        };

        /**
         * Queries for repositories.
         *
         * @param query
         * @param pagination
         * @returns response
         */
        queryRepositories(query, pagination)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/repositories/query", pagination, query, callback);
        };

        /**
         * Read a repository.
         *
         * @param repository
         *
         * @returns {*}
         */
        readRepository(repository)
        {
            var repositoryId = this.acquireId(repository);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/repositories/" + repositoryId, {}, callback);
        };

        /**
         * Updates a repository.
         *
         * @param repository
         * @param obj
         * 
         * @returns {*}
         *
         */
        updateRepository(repository, obj)
        {
            var repositoryId = this.acquireId(repository);
            var callback = this.extractOptionalCallback(arguments);

            return this.put("/repositories/" + repositoryId, {}, obj, callback);
        }

    }

    return RepositorySession;
};
