var AbstractService = require("./AbstractService");
var RepositoryService = require("./RepositoryService");

class PlatformService extends AbstractService
{
    constructor(session)
    {
        super(session);
    }

    // SERVICES

    repositoryService(repositoryId)
    {
        return new RepositoryService(this.session, repositoryId);
    }

    // METHODS

    /**
     * Queries for repositories.
     *
     * @param query
     * @param pagination
     * @returns {*}
     */
    queryRepositories(query, pagination, callback)
    {
        return this.session.post("/repositories/query", pagination, query, callback);
    };

}

module.exports = PlatformService;