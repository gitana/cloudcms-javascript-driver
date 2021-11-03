const AbstractObject = require("./AbstractObject");

class Domain extends AbstractObject
{
    static DOMAIN_FNS = [
        "readPrincipal",
        "queryPrincipals"
    ];

    constructor(session, obj)
    {
        Object.assign(this, obj);
        this.session = session;

        // bind all methods to this
        for (let fn of Domain.DOMAIN_FNS)
        {
            this[fn] = session[fn].bind(session, this._doc);
        }
    }


} 

module.exports = Domain;