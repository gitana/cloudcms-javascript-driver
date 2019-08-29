var Platform                        = require("./platform");
var Repository                      = require("./repository");
var Branch                          = require("./branch");

class API
{
    constructor()
    {
    }

    platform()
    {
        return new Platform();
    }

    repository(repositoryId)
    {
        return new Repository(repositoryId);
    }

    branch(repositoryId, branchId)
    {
        return this.repository(repositoryId).branch(branchId);
    }
};

module.exports = API;