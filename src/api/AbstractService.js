var Helper = require("../helper");

class AbstractService
{
    constructor(session)
    {
        this.session = session;

        // helper method
        this.acquireId = Helper.acquireId;
    }
}

module.exports = AbstractService;