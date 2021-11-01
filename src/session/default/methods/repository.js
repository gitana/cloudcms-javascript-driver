module.exports = function(Session)
{
    const Repository = require("../objects/Repository");

    class RepositorySession extends Session
    {
        /**
         * Create a repository.
         *
         * @param obj
         * @returns object
         */
        async createRepository(obj)
        {
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.post("/repositories", {}, obj, callback);
            return new Repository(this, result);
        };

        /**
         * Queries for repositories.
         *
         * @param query
         * @param pagination
         * @returns response
         */
        async queryRepositories(query, pagination)
        {
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.post("/repositories", {}, obj, callback);
            result.rows = result.rows.map(row => new Repository(this, row));
            return result;
        };

    }

    return RepositorySession;
};
