class AbstractObject {
    toJSON(key) {
        if (key) {
            console.log(key);
            return JSON.stringify(this[key]);
        }

        // whole object
        return JSON.stringify({...this});
    }
}

module.exports = AbstractObject