var Node = require("./node");

class Branch
{
    constructor(repositoryId, branchId)
    {
        this.repositoryId = repositoryId;
        this.branchId = branchId;
    }

    node(nodeId)
    {
        return new Node(this.repositoryId, this.branchId, nodeId);
    }

    readNode(session, nodeId)
    {
        return session.get("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/" + nodeId);
    };

    queryNodes(session, query, pagination)
    {
        return session.post("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/query", pagination, query);
    };
};

module.exports = Branch;