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

    }

    return RepositorySession;
};
