module.exports = function(Session)
{
    class DomainSession extends Session
    {
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

    return DomainSession;
};