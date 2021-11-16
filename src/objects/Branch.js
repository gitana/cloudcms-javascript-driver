const AbstractObject = require("./AbstractObject");

const BRANCH_FNS = [
    "queryNodes",
    "queryOneNode",
    "readNode",
    "searchNodes",
    "findNodes",
    "createNode",
    "deleteNodes",

    "graphqlQuery",
    "graphqlSchema",

    "deleteBranch",
    "updateBranch",
    "resetBranch",

    "trackPage"
];
class Branch extends AbstractObject
{
    

    constructor(session, repositoryId, obj)
    {
        super();
        Object.assign(this, obj)
        this.session = session;
        this.repositoryId = repositoryId;

        // bind all branch methods to this
        for (let fn of BRANCH_FNS)
        {
            this[fn] = session[fn].bind(session, this.repositoryId, this._doc);
        }
    }


} 

module.exports = Branch;