module.exports = function(Session)
{
    const Domain = require("../../../objects/Domain");

    class DomainSession extends Session
    {
        /**
         * Create a domain.
         *
         * @param obj
         * @returns object
         */
        async createDomain(obj)
        {
            var callback = this.extractOptionalCallback(arguments);

            let result = this.post("/domains", {}, obj, callback);
            return new Domain(this, result);
        };

        /**
         * Queries for domains.
         *
         * @param query
         * @param pagination
         * @returns response
         */
        async queryDomains(query, pagination)
        {
            var callback = this.extractOptionalCallback(arguments);

            let result = this.post("/domains/query", pagination, query, callback);
            result.rows = result.rows.map(row => new Domain(this, row));
            return result;
        };

        /**
         * Reads a domain.
         *
         * @param domainId
         * @returns {*}
         */
        async readDomain(domainId)
        {
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.get("/domains/" + domainId, {}, callback);
            result.rows = result.rows.map(row => new Domain(this, row));
            return result;
        }
    }

    return DomainSession;
};