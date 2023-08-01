var Helper = require("../../src/helper");

class CustomStorage
{
    constructor(config)
    {
        this.config = Helper.cleanKeys(config);

        this.memory = {};
    }

    delete(key)
    {
        console.log("DELETE: " + key);
        delete this.memory[key];
    }

    read(key)
    {
        console.log("READ: " + key);
        return this.memory[key];

    }

    write(key, value)
    {
        console.log("WRITE: " + key + " = " + value);
        this.memory[key] = value;
    }
}

module.exports = CustomStorage;