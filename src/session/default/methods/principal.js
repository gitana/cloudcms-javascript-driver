module.exports = function(Session)
{
    class PrincipalSession extends Session
    {
        readPrincipal(domain, principalId)
        {
            var domainId = this.acquireId(domain);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/domains/" + domainId + "/principals/" + principalId, {}, callback);
        }

        queryPrincipals(domain, query, pagination)
        {
            var domainId = this.acquireId(domain);
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/domains/" + domainId + "/principals/query", pagination, query, callback);
        }
    }

    return PrincipalSession;
};
