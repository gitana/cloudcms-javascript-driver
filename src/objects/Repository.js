
class Repository
{
    static REPOSITORY_FNS = [
        "queryBranches",
        "readBranch",
        "createBranch",
        "listBranches",
        "deleteBranch",
        "updateBranch",
        "resetBranch",

        "readChangeset",
        "queryChangesets",
        "listChangesets",
        "listChangesetNodes"
    ];

    constructor(session, obj)
    {
        Object.assign(this, obj);

        // bind all methods to this
        for (let fn of Repository.REPOSITORY_FNS)
        {
            this[fn] = session[fn].bind(session, this._doc);
        }
    }


} 

module.exports = Repository;