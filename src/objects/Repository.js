const AbstractObject = require("./AbstractObject");

const REPOSITORY_FNS = [
    "queryBranches",
    "readBranch",
    "createBranch",
    "listBranches",

    "readChangeset",
    "queryChangesets",
    "listChangesets",
    "listChangesetNodes"
];
class Repository extends AbstractObject
{
    constructor(session, obj)
    {
        super();
        Object.assign(this, obj);

        // bind all methods to this
        for (let fn of REPOSITORY_FNS)
        {
            this[fn] = session[fn].bind(session, this._doc);
        }
    }


} 

module.exports = Repository;