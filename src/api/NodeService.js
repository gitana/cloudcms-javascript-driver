var AbstractService = require("./AbstractService");

class NodeService extends AbstractService
{
    constructor(session, repositoryId, branchId, nodeId)
    {
        super(session);

        this.repositoryId = repositoryId;
        this.branchId = branchId;
        this.nodeId = nodeId;
    }

    queryRelatives(associationTypeQName, associationDirection, query, pagination, callback)
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

        return this.session.post("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/" + this.nodeId + "/relatives/query", qs, query, callback);
    };

    queryChildren(query, pagination, callback)
    {
        return this.queryRelatives("a:child", "OUTGOING", query, pagination, callback);
    };

    listAssociations(associationDirection, pagination, callback)
    {
        var qs = {};

        if (pagination)
        {
            for (var k in pagination)
            {
                qs[k] = pagination[k];
            }
        }

        if (associationDirection)
        {
            qs.direction = associationDirection;
        }

        return this.session.get("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/" + this.nodeId + "/associations", qs, callback);
    };

    listOutgoingAssociations(pagination, callback)
    {
        return this.listAssociations("OUTGOING", pagination, callback);
    };

    listIncomingAssociations(pagination, callback)
    {
        return this.listAssociations("INCOMING", pagination, callback);
    };

    associate(target, associationType, associationDirectionality, callback)
    {
        var targetId = this.acquireId(target);

        var qs = {};
        qs.node = targetId;

        if (associationType)
        {
            qs.type = associationType;
        }

        if (associationDirectionality)
        {
            qs.directionality = associationDirectionality;
        }

        return this.session.post("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/" + this.nodeId + "/associate", qs, callback);
    }

    unassociate(target, associationType, associationDirectionality, callback)
    {
        var targetId = this.acquireId(target);

        var qs = {};
        qs.node = targetId;

        if (associationType)
        {
            qs.type = associationType;
        }

        if (associationDirectionality)
        {
            qs.directionality = associationDirectionality;
        }

        return this.session.post("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/" + this.nodeId + "/unassociate", qs, callback);
    }

    associateChild(target, callback)
    {
        return this.associate(target, "a:child", "DIRECTED", callback);
    }

    unassociateChild(target, callback)
    {
        return this.unassociate(target, "a:child", "UNDIRECTED", callback);
    }

    del(callback)
    {
        return this.session.del("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/" + this.nodeId, callback);
    }

}

module.exports = NodeService;