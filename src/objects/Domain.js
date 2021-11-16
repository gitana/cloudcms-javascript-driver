const AbstractObject = require("./AbstractObject");


const DOMAIN_FNS = [
    "readPrincipal",
    "queryPrincipals"
];
class Domain extends AbstractObject
{

    constructor(session, obj)
    {
        super();
        Object.assign(this, obj);
        this.session = session;

        // bind all methods to this
        for (let fn of DOMAIN_FNS)
        {
            this[fn] = session[fn].bind(session, this._doc);
        }
    }


} 

module.exports = Domain;