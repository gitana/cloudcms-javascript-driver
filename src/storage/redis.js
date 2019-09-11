var Extensions = require("../extensions");

class RedisStorage
{
    constructor(config)
    {
        this.config = config;
    }
}

// register
Extensions.storage("redis", RedisStorage);

module.exports = RedisStorage;