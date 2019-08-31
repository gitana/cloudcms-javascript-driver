var AbstractService = require("./AbstractService");
var BranchService = require("./BranchService");

class RepositoryService extends AbstractService
{
    constructor(session, repositoryId)
    {
        super(session);

        this.repositoryId = repositoryId;
    }

    // SERVICES

    branchService(branchOrBranchId)
    {
        return new BranchService(this.session, this.repositoryId, this.acquireId(branchOrBranchId));
    }

    // METHODS

    /**
     * Queries for branches.
     *
     * @param query
     * @param pagination
     * @param [Function] callback
     *
     * @returns {*}
     */
    queryBranches(query, pagination, callback)
    {
        return this.session.post("/repositories/" + this.repositoryId + "/branches/query", pagination, query, callback);
    };

}

module.exports = RepositoryService;