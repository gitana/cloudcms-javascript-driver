var Helper = require("./helper");
const moment = require("moment/moment");

const { HttpsProxyAgent } = require("https-proxy-agent");
const { HttpProxyAgent } = require("http-proxy-agent");
const { getProxyForUrl } = require("proxy-from-env");

var ONE_HOUR_MS = 1000 * 60 * 60;

class Engine
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
            if (self.credentials)
            {
                requestObject = self.credentials.sign(requestObject);
            }

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
                self.credentials = newSession.engine.credentials;

                callback();
            });
        };

        // checks HTTP_PROXY, HTTPS_PROXY and NO_PROXY environment variables
        // determines whether a proxy should be configured (otherwise null)
        // sets proxy settings onto options
        this.applyAgent = function(url, fn)
        {
            // checks HTTP_PROXY, HTTPS_PROXY and NO_PROXY environment variables
            // determines whether a proxy should be configured (otherwise null)
            var proxy = getProxyForUrl(url);
            if (proxy)
            {
                // bind in http proxy
                if (url.startsWith("https:"))
                {
                    fn(null, new HttpsProxyAgent(proxy));
                }
                else if (url.startsWith("http:"))
                {
                    fn(new HttpProxyAgent(proxy));
                }
            }
        };

        // @abstract
        this.buildGetHandler = function(uri, qs, headers)
        {
            return function(done)
            {
                // TODO
            }
        };

        // @abstract
        this.buildPostHandler = function(uri, qs, payload, headers)
        {
            return function(done)
            {
                // TODO
            }
        };

        // @abstract
        this.buildPutHandler = function(uri, qs, payload, headers)
        {
            return function(done)
            {
                // TODO
            }
        };

        // @abstract
        this.buildDeleteHandler = function(uri, qs, headers)
        {
            return function(done)
            {
                // TODO
            }
        };

        // @abstract
        this.buildPatchHandler = function(uri, qs, payload, headers)
        {
            return function(done)
            {
                // TODO
            }
        };

        // @abstract
        this.buildMultipartPostHandler = function(uri, qs, payload, headers)
        {
            return function(done)
            {
                // TODO
            }
        }

        // @abstract
        this.buildDownloadHandler = function(uri, params, headers)
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
     * @param headers
     */
    get(uri, qs, headers, callback)
    {
        var fn = this.buildGetHandler(uri, qs, headers);

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
     * @param headers
     */
    post(uri, qs, payload, headers, callback)
    {
        var fn = this.buildPostHandler(uri, qs, payload, headers);

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
     * @param headers
     */
    put(uri, qs, payload, headers, callback)
    {
        var fn = this.buildPutHandler(uri, qs, payload, headers);

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
     * @param headers
     */
    del(uri, qs, headers, callback)
    {
        var fn = this.buildDeleteHandler(uri, qs, headers);

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
     * @param headers
     */
    patch(uri, qs, payload, headers, callback)
    {
        var fn = this.buildPatchHandler(uri, qs, payload, headers);

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
     * @param qs
     * @param payload
     * @param headers
     */
    multipartPost(uri, qs, payload, headers, callback)
    {
        var fn = this.buildMultipartPostHandler(uri, qs, payload, headers);

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
     * @param headesr
     */
    download(uri, qs, headers, callback)
    {
        var fn = this.buildDownloadHandler(uri, qs, headers);

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
            //console.log("R: " + JSON.stringify(result, null, 2));

            var accessToken = result["access_token"];
            var tokenType = result["token_type"];
            var refreshToken = result["refresh_token"];
            var expires_in = result["expires_in"];
            var _scope = result["scope"];
            var expiresMs = moment().add(expires_in, "seconds").valueOf();

            return {
                "accessToken": accessToken,
                "refreshToken": refreshToken,
                "tokenType": tokenType,
                "expires_in": expires_in,
                "expiresMs": expiresMs,
                "scope": _scope,
                "sign": function(requestObject) {

                    // Sign a standardised request object with user authentication information.
                    if (!accessToken) {
                        throw new Error('Unable to sign without access token')
                    }

                    requestObject.headers = requestObject.headers || {}

                    if (tokenType === 'bearer' && !requestObject.headers.Authorization) {
                        requestObject.headers.Authorization = 'Bearer ' + accessToken
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
                            return callback(e);
                        }

                        result.then(result => {
                            var newCredentials = buildCredentials(result);
                            callback(null, newCredentials);
                        })
                        .catch(err => {
                            callback(err);
                        });
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
                    var credentials = self.credentials = buildCredentials(result);
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

module.exports = Engine;
