var Extensions = require("../extensions");

var extendFn = function(Session, Helper)
{
    class c extends Session {

        constructor(config, driver, storage)
        {
            super(config, driver, storage)
        }

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

    return c;
};

Extensions.session("repository", extendFn, { "core": true });
