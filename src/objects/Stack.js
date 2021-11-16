const AbstractObject = require("./AbstractObject");

const STACK_FNS = [
    "readDataStore",
    "listDataStores",
    "queryDataStores",
    "assignDataStore",
    "unassignDataStore"
];
class Stack extends AbstractObject
{
    

    constructor(session, obj)
    {
        super();
        Object.assign(this, obj);
        this.session = session;

        // bind all methods to this
        for (let fn of STACK_FNS)
        {
            this[fn] = session[fn].bind(session, this._doc);
        }
    }


} 

module.exports = Stack;