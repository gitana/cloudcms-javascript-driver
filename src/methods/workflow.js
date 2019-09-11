var Extensions = require("../extensions");

var extendFn = function(Session, Helper)
{
    class c extends Session {

        constructor(config, driver, storage)
        {
            super(config, driver, storage)
        }

        queryWorkflows(query, pagination)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/workflow/instances/query", pagination, query, callback);
        };

    }

    return c;
};

Extensions.session("workflow", extendFn, { "core": true });
