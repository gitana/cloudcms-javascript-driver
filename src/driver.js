var Helper = require("./helper");

class Driver
{
    constructor(config, credentials, storage)
    {
        this.config = config;
        this.credentials = credentials;
        this.storage = storage;

        this.incoming = function(requestObject)
        {
            // make sure the URL isn't relative
            if (requestObject["url"].indexOf("http://") === 0 || requestObject["url"].indexOf("https://") === 0) {
                // ok
            } else {
                requestObject["url"] = [this.config.baseURL, requestObject["url"]].join("/");
            }

            // sign the request
            requestObject = credentials.sign(requestObject);

            // hand it back
            return requestObject;
        };

        this.outgoing = function(responseBody)
        {
            return Helper.parseJson("" + responseBody);
        };

        // @abstract
        this.buildGetHandler = function(uri, qs)
        {
            return function(done)
            {
                // TODO
            }
        };

        // @abstract
        this.buildPostHandler = function(uri, qs, payload)
        {
            return function(done)
            {
                // TODO
            }
        };

        // @abstract
        this.buildPutHandler = function(uri, qs, payload)
        {
            return function(done)
            {
                // TODO
            }
        };

        // @abstract
        this.buildDeleteHandler = function(uri, qs)
        {
            return function(done)
            {
                // TODO
            }
        };
    }

    /**
     * @extension_point
     *
     *
     *
     * @param uri
     * @param qs
     */
    get(uri, qs, callback)
    {
        var fn = this.buildGetHandler(uri, qs);

        // support for callback approach
        if (callback && Helper.isFunction(callback))
        {
            return fn(function(err, result) {
                callback(err, result);
            });
        }

        var promise = new Promise((resolve, reject) => {

            fn(function(err, result) {

                if (err) {
                    return reject(err);
                }

                resolve(result);
            });
        });

        return promise;
    }

    /**
     * @extension_point
     *
     * @param uri
     * @param qs
     * @param payload
     */
    post(uri, qs, payload, callback)
    {
        var fn = this.buildPostHandler(uri, qs, payload);

        // support for callback approach
        if (callback && Helper.isFunction(callback))
        {
            return fn(function(err, result) {
                callback(err, result);
            });
        }

        var promise = new Promise((resolve, reject) => {

            fn(function(err, result) {

                if (err) {
                    return reject(err);
                }

                resolve(result);
            });
        });

        return promise;
    }

    /**
     * @extension_point
     *
     * @param uri
     * @param qs
     * @param payload
     */
    put(uri, qs, payload, callback)
    {
        var fn = this.buildPutHandler(uri, qs, payload);

        // support for callback approach
        if (callback && Helper.isFunction(callback))
        {
            return fn(function(err, result) {
                callback(err, result);
            });
        }

        var promise = new Promise((resolve, reject) => {

            fn(function(err, result) {

                if (err) {
                    return reject(err);
                }

                resolve(result);
            });
        });

        return promise;
    }

    /**
     * @extension_point
     *
     * @param uri
     * @param qs
     */
    del(uri, qs, callback)
    {
        var fn = this.buildDelHandler(uri, qs);

        // support for callback approach
        if (callback && Helper.isFunction(callback))
        {
            return fn(function(err, result) {
                callback(err, result);
            });
        }

        var promise = new Promise((resolve, reject) => {

            fn(function(err, result) {

                if (err) {
                    return reject(err);
                }

                resolve(result);
            });
        });

        return promise;
    }

    /**
     * requestObject
     *
     * @param uri
     * @param parts
     */
    multipartPost(uri, parts, callback)
    {
        // TODO
    }
}

module.exports = Driver;
