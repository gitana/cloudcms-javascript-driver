var AbstractService = require("./AbstractService");
var NodeService = require("./NodeService");

class BranchService extends AbstractService
{
    constructor(session, repositoryId, branchId)
    {
        super(session);

        this.repositoryId = repositoryId;
        this.branchId = branchId;
    }

    // SERVICES

    nodeService(nodeId)
    {
        return new NodeService(this.session, this.repositoryId, this.branchId, nodeId);
    }

    // METHODS

    /**
     * Reads a node.
     *
     * @param nodeId
     * @returns {*}
     */
    readNode(nodeId, callback)
    {
        return this.session.get("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/" + nodeId, callback);
    }

    /**
     * Queries for nodes.
     *
     * @param query
     * @param pagination
     * @param callback
     * @returns {*}
     */
    queryNodes(query, pagination, callback)
    {
        return this.session.post("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/query", pagination, query, callback);
    }
}

module.exports = BranchService;