var Helper = require("./helper");

var ONE_HOUR_MS = 1000 * 60 * 60;

class Driver
{
    constructor(config, credentials, storage)
    {
        this.config = Helper.cleanKeys(config);
        this.credentials = credentials;
        this.storage = storage;

        this._reauthenticateFn = null;

        this.incoming = function(requestObject)
        {
            var self = this;

            // make sure the URL isn't relative
            if (requestObject["url"].indexOf("http://") === 0 || requestObject["url"].indexOf("https://") === 0)
            {
                // ok
            }
            else
            {
                if (requestObject["url"].startsWith("/"))
                {
                    requestObject["url"] = requestObject["url"].substring(1);
                }

                requestObject["url"] = [this.config.baseURL, requestObject["url"]].join("/");
            }

            // sign the request
            requestObject = self.credentials.sign(requestObject);

            // hand it back
            return requestObject;
        };

        this.outgoing = function(responseBody)
        {
            var outgoingBody = responseBody;

            if (Helper.isString(responseBody))
            {
                try
                {
                    outgoingBody = Helper.parseJson("" + responseBody);
                }
                catch (e)
                {
                    // not JSON
                }
            }

            return outgoingBody;
        };

        this.isInvalidAccessToken = function(err, response, body)
        {
            var self = this;

            // {"error":"invalid_token","error_description":"Invalid access token: 06ef574a-d177-4ba9-ac4b-5a57555a3a8d"}
            if (response.statusCode === 401)
            {
                var json = self.outgoing(body);
                return (json.error === "invalid_token");
            }

            return false;
        };

        this.handleRefreshAccessToken = function(err, response, body)
        {
            var self = this;

            // use the refresh token to acquire a new access token
            return new Promise((resolve, reject) => {
                self.credentials.refresh(function(err, newCredentials) {
                    if (err) {
                        return self.handleRefreshFailure(function(refreshErr) {
                            if(refreshErr) {
                                reject(refreshErr);
                            } 
                            else {
                                resolve(self.outgoing(body));
                            }
                        });
                    }
    
                    self.credentials = newCredentials;
                    resolve(self.outgoing(body));
                });
            });
        };

        this.ensureTokenState = function(callback)
        {
            var self = this;

            var expirationMs = self.credentials.expiresMs;
            var now = new Date().getTime();

            var timeUntilExpirationMs = expirationMs - now;
            if (timeUntilExpirationMs < ONE_HOUR_MS)
            {
                // refresh right away
                self.credentials.refresh(function(err, newCredentials) {

                    if (err) {
                        return self.handleRefreshFailure(function(refreshErr) {
                            if(refreshErr) {
                                callback(refreshErr);
                            } else{
                                callback();
                            }
                        });
                    }

                    self.credentials = newCredentials;

                    callback();
                });
            }
            else
            {
                callback();
            }
        };

        this.handleRefreshFailure = function(callback)
        {
            var self = this;

            if (!self._reauthenticateFn) {
                return callback(new Error("Refresh key expired"));
            }

            // wipe down credentials
            self.credentials = null;

            // reauthenticate
            self._reauthenticateFn.call(self, function (err, newSession) {

                if (err) {
                    return callback(err);
                }

                // assign new credentials
                self.credentials = newSession.driver.credentials;

                callback();
            });
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

        // @abstract
        this.buildPatchHandler = function(uri, qs, payload)
        {
            return function(done)
            {
                // TODO
            }
        };

        // @abstract
        this.buildMultipartPostHandler = function(uri, qs, payload)
        {
            return function(done)
            {
                //
            }
        }

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
     * @extension_point
     *
     * @param uri
     * @param qs
     * @param payload
     */
    patch(uri, qs, payload, callback)
    {
        var fn = this.buildPatchHandler(uri, qs, payload);

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
    multipartPost(uri, qs, formData, callback)
    {
        var fn = this.buildMultipartPostHandler(uri, qs, formData);

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
     *
     *
     * @param uri
     * @param qs
     */
    download(uri, qs, callback)
    {
        var fn = this.buildDownloadHandler(uri, qs);

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
     * Assigns a reauthentication function.
     *
     * @param reauthenticateFn
     */
    reauthenticate(reauthenticateFn)
    {
        this._reauthenticateFn = reauthenticateFn;
    }

    disconnect(callback)
    {
        this.post("/auth/expire", {}, {}, function(err) {
            callback(err);
        });
    }
}

module.exports = Driver;
