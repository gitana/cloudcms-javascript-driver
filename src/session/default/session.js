var Helper = require("../../helper");

// define base class
class DefaultSession
{
    constructor(config, driver, storage)
    {
        this.config = config;
        this.driver = driver;
        this.storage = storage;

        this.defaults = {
            "qs": {}
        };

        // helper method
        this.acquireId = function(objOrId)
        {
            var id = Helper.acquireId(objOrId);
            if (!id) {
                throw new Error("Cannot acquire _doc for: " + objOrId);
            }

            return id;
        };

        this.acquireIds = function(collection)
        {
            var array = [];

            if (Helper.isString(collection))
            {
                var parts = collection.split(",");
                for (var i = 0; i < parts.length; i++)
                {
                    array.push(parts[i].trim());
                }
            }
            else if (Helper.isArray(collection))
            {
                for (var i = 0; i < collection.length; i++)
                {
                    var x = collection[i];

                    if (Helper.isString(x))
                    {
                        array.push(x);
                    }
                    else if (Helper.isObject(x))
                    {
                        array.push(this.acquireId(x));
                    }
                }
            }
            else if (Helper.isObject(collection))
            {
                // assume it is a map (key -> value)

                for (var k in collection)
                {
                    var v = collection[k];
                    if (v)
                    {
                        array.push(this.acquireId(v));
                    }
                }
            }

            return array;
        };

        this.populateDefaultQs = function(qs)
        {
            if (!qs) {
                qs = {};
            }

            for (var k in this.defaults.qs)
            {
                qs[k] = this.defaults.qs[k];
            }

            return qs;
        };

        this.extractOptionalCallback = function(_arguments)
        {
            var args = Array.prototype.slice.call(_arguments);

            if (args.length > 0)
            {
                var candidate = args[args.length - 1];
                if (Helper.isFunction(candidate))
                {
                    return candidate;
                }
            }

            return null;
        };

        this.get = function(uri, qs, callback)
        {
            qs = this.populateDefaultQs(qs);

            //var driver = this.driver;

            /*
            var outerPromise = new Promise(function(resolve, reject) {
                var innerPromise = driver.get(uri, qs);
                innerPromise.then(function(response) {

                    //console.log("INNER PROMISE RESOLVE!");

                    resolve(response);
                });
            });

            return outerPromise;
            */

            return this.driver.get(uri, qs, callback);
        };

        this.post = function(uri, qs, payload, callback)
        {
            qs = this.populateDefaultQs(qs);

            return this.driver.post(uri, qs, payload, callback);
        };

        this.put = function(uri, qs, payload, callback)
        {
            qs = this.populateDefaultQs(qs);

            return this.driver.put(uri, qs, payload, callback);
        };

        this.del = function(uri, qs, callback)
        {
            qs = this.populateDefaultQs(qs);

            return this.driver.del(uri, qs, callback);
        };

        this.patch = function(uri, qs, payload, callback)
        {
            qs = this.populateDefaultQs(qs);

            return this.driver.patch(uri, qs, payload, callback);
        };

        this.multipartPost = function(uri, parts, callback)
        {
            // TODO
            return this.driver.multipartPost(uri, parts, callback);
        };
    }

    // HELPER FUNCTIONS

    /**
     * Sleeps for the given amount of time.  Returns a promise.
     * Supports callbacks like all other methods.
     *
     * @param t
     * @param v
     * @returns {Promise<any>}
     */
    sleep(ms)
    {
        var me = this;

        var callback = this.extractOptionalCallback(arguments);

        if (callback)
        {
            return setTimeout(function() {
                callback.bind(me)();
            }, ms);
        }

        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve.bind(me)();
            }, ms)
        });
    }

    stringify(obj, pretty)
    {
        if (pretty) {
            return JSON.stringify(obj, null, 2)
        }

        return JSON.stringify(obj);
    }

    parse(text)
    {
        return JSON.parse(text);
    }

    // ALL OTHER METHODS ARE PULLED IN BELOW
};

var modulePaths = [
    "./methods/branch",
    "./methods/domain",
    "./methods/graphql",
    "./methods/node",
    "./methods/principal",
    "./methods/repository",
    "./methods/workflow"
];
for (var i = 0; i < modulePaths.length; i++)
{
    DefaultSession = require(modulePaths[i])(DefaultSession)
}

module.exports = DefaultSession;