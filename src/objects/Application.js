
class Application
{
    static APPLICATION_FNS = [

    ];

    constructor(session, obj)
    {
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