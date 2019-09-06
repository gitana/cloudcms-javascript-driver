var AbstractService = require("./AbstractService");
var BranchService = require("./BranchService");

class RepositoryService extends AbstractService
{
    constructor(session, repositoryId)
    {
        super(session);

        this.repositoryId = repositoryId;

        this.cleanBeforeWrite = function(obj)
        {
            // TODO
        }
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

    del(callback)
    {
        return this.session.del("/repositories/" + this.repositoryId, {}, callback);
    }

    update(obj, callback)
    {
        this.cleanBeforeWrite(obj);

        this.session.put("/repositories/" + this.repositoryId, {}, obj, callback);
    }

}

module.exports = RepositoryService;