
class Branch
{
    static BRANCH_FNS = [
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

    constructor(session, repositoryId, obj)
    {
        Object.assign(this, obj)
        this.session = session;
        this.repositoryId = repositoryId;

        // bind all branch methods to this
        for (let fn of Branch.BRANCH_FNS)
        {
            this[fn] = session[fn].bind(session, this.repositoryId, this._doc);
        }
    }


} 

module.exports = Branch;