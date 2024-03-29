var Helper = require("../../helper");

class MemoryStorage
{
    constructor(config)
    {
        this.config = Helper.cleanKeys(config);

        this.memory = {};
    }

    delete(key)
    {
        delete this.memory[key];
    }

    read(key)
    {
        return this.memory[key];

    }

    write(key, value)
    {
        this.memory[key] = value;
    }
}

module.exports = MemoryStorage;