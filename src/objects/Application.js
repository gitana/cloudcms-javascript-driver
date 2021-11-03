const AbstractObject = require("./AbstractObject");

class Application extends AbstractObject
{
    static APPLICATION_FNS = [

    ];

    constructor(session, obj)
    {
        super();
        Object.assign(this, obj);
        this.session = session;
        
        // bind all methods to this
        for (let fn of Application.APPLICATION_FNS)
        {
            this[fn] = session[fn].bind(session, this._doc);
        }
    }


} 

module.exports = Application;