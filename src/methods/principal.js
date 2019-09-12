var Extensions = require("../extensions");

var extendFn = function(Session, Helper)
{
    class c extends Session {

        constructor(config, driver, storage)
        {
            super(config, driver, storage)
        }

        readPrincipal(domain, principalId)
        {
            var domainId = this.acquireId(domain);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/domains/" + domainId + "/principals/" + principalId, {}, callback);
        }

    }

    return c;
};

Extensions.session("principal", extendFn, { "core": true });
