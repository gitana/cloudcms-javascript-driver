
class Node
{
    static NODE_FNS = [
        "queryNodeRelatives",
        "queryNodeChildren",
        "listNodeAssociations",
        "listOutgoingAssociations",
        "associate",
        "unassociate",
        "associateChild",
        "deleteNode",
        "updateNode",
        "patchNode",
        "addNodeFeature",
        "removeNodeFeature",
        "refreshNode",
        "changeNodeQName",
        "nodeTree",
        "resolveNodePath",
        "resolveNodePaths",
        "traverseNode",
        "uploadAttachment",
        "downloadAttachment",
        "listAttachments",
        "deleteAttachment",
        "listVersions",
        "readVersion",
        "restoreVersion"
    ];

    constructor(session, repositoryId, branchId, obj)
    {
        Object.assign(this, obj)
        this.session = session;
        this.repositoryId = repositoryId;
        this.branchId = branchId;

        // bind all branch methods to this
        for (let fn of Node.NODE_FNS)
        {
            this[fn] = session[fn].bind(session, this.repositoryId, this.branchId, this._doc);
        }
    }


} 

module.exports = Node;