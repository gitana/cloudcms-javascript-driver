var Extensions = require("../extensions");

var extendFn = function(Session, Helper)
{
    class c extends Session {

        constructor(config, driver, storage)
        {
            super(config, driver, storage)
        }

        /**
         * Create a domain.
         *
         * @param obj
         * @returns object
         */
        createDomain(obj)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/domains", {}, obj, callback);
        };

        /**
         * Queries for domains.
         *
         * @param query
         * @param pagination
         * @returns response
         */
        queryDomains(query, pagination)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/domains/query", pagination, query, callback);
        };

        /**
         * Reads a domain.
         *
         * @param domainId
         * @returns {*}
         */
        readDomain(domainId)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/domains/" + domainId, {}, callback);
        }

    }

    return c;
};

Extensions.session("domain", extendFn, { "core": true });
