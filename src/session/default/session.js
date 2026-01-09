var Helper = require("../../helper");

// define base class
class DefaultSession
{
    constructor(config, engine, storage)
    {
        this.config = Helper.cleanKeys(config);
        this.engine = engine;
        this.storage = storage;

        this.defaults = {
            "qs": {
                "full": true
            }
        };

        // band is assumed null (default)
        this.band = null;

        // helper method
        this.acquireId = function(objOrId)
        {
            var id = Helper.acquireId(objOrId);
            if (!id)
            {
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
                if (!(k in qs))
                {
                    qs[k] = this.defaults.qs[k];
                }
            }

            // pass band via query string?
            // if (this.band)
            // {
            //     qs["band"] = this.band;
            // }

            return qs;
        };

        this.generateHeaders = function()
        {
            var headers = {};

            // pass band via headers?
            if (this.band)
            {
                headers["x-cloudcms-band-id"] = this.band;
            }

            return headers;
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
            var self = this;

            qs = this.populateDefaultQs(qs);

            var headers = this.generateHeaders();

            return this.engine.get(uri, qs, headers, callback);
        };

        this.post = function(uri, qs, payload, callback)
        {
            var self = this;

            qs = this.populateDefaultQs(qs);

            var headers = this.generateHeaders();

            return this.engine.post(uri, qs, payload, headers, callback);
        };

        this.put = function(uri, qs, payload, callback)
        {
            var self = this;

            qs = this.populateDefaultQs(qs);

            var headers = this.generateHeaders();

            return this.engine.put(uri, qs, payload, headers, callback);
        };

        this.del = function(uri, qs, callback)
        {
            var self = this;

            qs = this.populateDefaultQs(qs);

            var headers = this.generateHeaders();

            return this.engine.del(uri, qs, headers, callback);
        };

        this.patch = function(uri, qs, payload, callback)
        {
            var self = this;

            qs = this.populateDefaultQs(qs);

            var headers = this.generateHeaders();

            return this.engine.patch(uri, qs, payload, headers, callback);
        };

        this.multipartPost = function(uri, qs, formData, callback)
        {
            var self = this;

            var headers = this.generateHeaders();

            return this.engine.multipartPost(uri, qs, formData, headers, callback);
        };

        this.download = function(uri, qs, callback)
        {
            var self = this;

            qs = this.populateDefaultQs(qs);

            var headers = this.generateHeaders();

            return this.engine.download(uri, qs, headers, callback);
        };
    }

    /**
     * Configures the session to use a specific band.
     *
     * @param bandId
     */
    useBand(bandId)
    {
        this.band = bandId;
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

    refresh(callback)
    {
        var engine = this.engine;

        var fn = function(done) {
            engine.credentials.refresh(function(err, newCredentials) {
                if (err) {
                    return done(err);
                }

                engine.credentials = newCredentials;

                done(err);
            });
        };

        // support for callback approach
        if (callback && Helper.isFunction(callback))
        {
            return fn(function(err) {
                callback(err);
            });
        }

        return new Promise(function(resolve, reject) {
            fn(function(err) {

                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    }

    disconnect(callback)
    {
        var engine = this.engine;

        var fn = function(done) {
            engine.disconnect(function(err) {
                done(err);
            });
        };

        // support for callback approach
        if (callback && Helper.isFunction(callback))
        {
            return fn(function(err) {
                callback(err);
            });
        }

        return new Promise(function(resolve, reject) {
            fn(function(err) {

                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    }

    reauthenticate(reauthenticateFn)
    {
        this.engine.reauthenticate(reauthenticateFn);
    }

    // ALL OTHER METHODS ARE PULLED IN BELOW
};

var modules = [
    require("./methods/branch"),
    require("./methods/domain"),
    require("./methods/graphql"),
    require("./methods/node"),
    require("./methods/principal"),
    require("./methods/repository"),
    require("./methods/workflow"),
    require("./methods/application"),
    require("./methods/project"),
    require("./methods/stack"),
    require("./methods/changeset"),
    require("./methods/job"),
    require("./methods/transfer"),
    require("./methods/tracker"),
    require("./methods/release"),
    require("./methods/platform"),
    require("./methods/archive"),
    require("./methods/editorial"),
    //require("./methods/sidekick")
];
for (var i = 0; i < modules.length; i++)
{
    DefaultSession = modules[i](DefaultSession)
}

module.exports = DefaultSession;