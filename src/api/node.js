class Node
{
    constructor(repositoryId, branchId, nodeId)
    {
        this.repositoryId = repositoryId;
        this.branchId = branchId;
        this.nodeId = nodeId;
    }

    queryRelatives(session, associationTypeQName, associationDirection, query, pagination)
    {
        var qs = {};

        if (pagination)
        {
            for (var k in pagination)
            {
                qs[k] = pagination[k];
            }
        }

        qs.type = associationTypeQName;
        qs.direction = associationDirection;

        if (!query) {
            query = {};
        }

        return session.post("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/" + this.nodeId + "/relatives/query", qs, query);
    };
};

module.exports = Node;