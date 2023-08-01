var Helper = require("../../helper");

class RedisStorage
{
    constructor(config)
    {
        this.config = Helper.cleanKeys(config);
    }
}

module.exports = RedisStorage;