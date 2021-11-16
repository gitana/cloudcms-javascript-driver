const AbstractObject = require("./AbstractObject");

const APPLICATION_FNS = [

];
class Application extends AbstractObject
{
    constructor(session, obj)
    {
        super();
        Object.assign(this, obj);
        this.session = session;
        
        // bind all methods to this
        for (let fn of APPLICATION_FNS)
        {
            this[fn] = session[fn].bind(session, this._doc);
        }
    }


} 

module.exports = Application;