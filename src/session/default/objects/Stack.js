
class Stack
{
    static STACK_FNS = [
        "readDataStore",
        "listDataStores",
        "queryDataStores",
        "assignDataStore",
        "unassignDataStore"
    ];

    constructor(session, obj)
    {
        Object.assign(this, obj);
        this.session = session;

        // bind all methods to this
        for (let fn of Stack.STACK_FNS)
        {
            this[fn] = session[fn].bind(session, this._doc);
        }
    }


} 

module.exports = Stack;