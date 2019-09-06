var AbstractService = require("./AbstractService");
var RepositoryService = require("./RepositoryService");

class PlatformService extends AbstractService
{
    constructor(session)
    {
        super(session);
    }

    // SERVICES

    repositoryService(repositoryOrRepositoryId)
    {
        return new RepositoryService(this.session, this.acquireId(repositoryOrRepositoryId));
    }

    // METHODS

    /**
     * Queries for repositories.
     *
     * @param query
     * @param pagination
     * @returns response
     */
    queryRepositories(query, pagination, callback)
    {
        return this.session.post("/repositories/query", pagination, query, callback);
    };

    /**
     * Create a repository.
     *
     * @param obj
     * @param callback
     * @returns object
     */
    createRepository(obj, callback)
    {
        return this.session.post("/repositories", {}, obj, callback);
    }

}

module.exports = PlatformService;