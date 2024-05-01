var Helper = require("./helper");
const moment = require("moment/moment");
const {refreshToken, ownerCredentials} = require("axios-oauth-client");

var ONE_HOUR_MS = 1000 * 60 * 60;

class Driver
{
    constructor(config, credentials, storage)
    {
        var self = this;

        //this.config = Helper.cleanKeys(config);
        this.config = config;
        this.credentials = credentials;
        this.storage = storage;

        this._reauthenticateFn = null;

        this.request = function(options, callback)
        {
            var cb = callback;
            callback = function() {
                cb.apply(this, arguments);
            }
            
            self.ensureTokenState(function(err) {
                if (err) {
                    callback(err)
                    return;
                }
                
                self.doRequest(options, async function(err, response, data, stats) {
                    var isInvalid = self.isInvalidAccessToken(err, response, data);

                    // Refresh token?
                    if (isInvalid)
                    {
                        try {
                            await self.handleRefreshAccessToken(err, response, data);
    
                            // Retry the request
                            self.doRequest(options, async function(err, response, data, stats) {
                                callback(err, response, data, stats);
                            })
                        }
                        catch (_err) {
                            err = _err;
                        }
                    }
                    else
                    {
                        callback(err, response, data, stats);
                    }
                });
            });
        };

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
                // TODO
            }
        }

        // @abstract
        this.buildGetRefreshToken = function()
        {
            return function(refreshToken, optionalScopes)
            {
                // TODO
            };
        };

        // @abstract
        this.buildGetOwnerCredentials = function()
        {
            return function(username, password, optionalScopes)
            {
                // TODO
            };
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

    connect(callback)
    {
        return this.authenticate(callback);
    }

    authenticate(callback)
    {
        var self = this;

        var getRefreshToken = this.buildGetRefreshToken();
        var getOwnerCredentials = this.buildGetOwnerCredentials();

        var optionalScopes = ["api"];

        var buildCredentials = function(result)
        {
            var accessToken = result["access_token"];
            var tokenType = result["token_type"];
            var refreshToken = result["refresh_token"];
            var expires = result["expires"];
            var expiresMs = moment(expires).valueOf();

            return {
                "accessToken": accessToken,
                "refreshToken": refreshToken,
                "tokenType": tokenType,
                "expires": expires,
                "expiresMs": expiresMs,
                "sign": function(requestObject) {

                    // Sign a standardised request object with user authentication information.
                    if (!accessToken) {
                        throw new Error('Unable to sign without access token')
                    }

                    requestObject.headers = requestObject.headers || {}

                    if (tokenType === 'bearer') {
                        requestObject.headers.Authorization = 'Bearer ' + this.accessToken
                    } else {
                        var parts = requestObject.url.split('#');
                        var token = 'access_token=' + accessToken;
                        var url = parts[0].replace(/[?&]access_token=[^&#]/, '');
                        var fragment = parts[1] ? '#' + parts[1] : '';

                        // Prepend the correct query string parameter to the url.
                        requestObject.url = url + (url.indexOf('?') > -1 ? '&' : '?') + token + fragment;

                        // Attempt to avoid storing the url in proxies, since the access token
                        // is exposed in the query parameters.
                        requestObject.headers.Pragma = 'no-store';
                        requestObject.headers['Cache-Control'] = 'no-store';
                    }

                    return requestObject;
                },
                "refresh": function(refreshToken, optionalScopes) {
                    return function (callback) {

                        var result = null;
                        try
                        {
                            result = async function() {
                                return await getRefreshToken(refreshToken, optionalScopes)
                            }();
                        }
                        catch (e)
                        {
                            return done(e);
                        }

                        var newCredentials = buildCredentials(result);
                        callback(null, newCredentials);
                    }
                }(refreshToken, optionalScopes)
            };
        };

        var fn = function(config, optionalScopes, done)
        {
            return function(done)
            {
                // authenticate
                getOwnerCredentials(config.username, config.password, optionalScopes).then(function(result) {
                    var credentials = buildCredentials(result);
                    return done(null, credentials);
                }).catch(function(err) {
                    return done(err);
                });
            }
        }(self.config, optionalScopes);

        // support for callback approach
        if (callback && Helper.isFunction(callback))
        {
            return fn(function(err) {
                callback(err);
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
}

module.exports = Driver;
