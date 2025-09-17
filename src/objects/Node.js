const AbstractObject = require("./AbstractObject");

const NODE_FNS = [
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
    "changeNodeTypeQName",
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
    "restoreVersion",
    "publishNodes",
    "unpublishNodes"
];
class Node extends AbstractObject
{

    constructor(session, repositoryId, branchId, obj)
    {
        super();
        Object.assign(this, obj)
        this.session = session;
        this.repositoryId = repositoryId;
        this.branchId = branchId;

        // bind all branch methods to this
        for (let fn of NODE_FNS)
        {
            this[fn] = session[fn].bind(session, this.repositoryId, this.branchId, this._doc);
        }
    }
} 

module.exports = Node;