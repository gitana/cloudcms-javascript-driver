var Engine = require("../../engine");
var Helper = require("../../helper");

class FetchEngine extends Engine
{
    constructor(config, credentials, storage, options)
    {
        super(config, credentials, storage, options);

        var self = this;
        if (options && options.fetch)
        {
            this.fetch = options.fetch
        }
        else
        {
            const [major, minor, patch] = process.versions.node.split('.').map(Number)
            if (major < 21)
            {
                this.fetch = require("node-fetch");;
            }
            else
            {
                this.fetch = fetch;
            }
        }

        this.doRequest = (options, callback) =>
        {
            var stats = {};
            stats.startTime = Helper.now();
        
            var response = null;
            var err = null;

            // parse params
            var params = new URLSearchParams(options.params);
            options.url += "?" + params.toString();

            var signedOptions = this.incoming(options);

            self.applyAgent(signedOptions.url, function(httpProxyAgent, httpsProxyAgent) {

                if (httpProxyAgent) {
                    signedOptions.agent = httpProxyAgent;
                } else if (httpsProxyAgent) {
                    signedOptions.agent = httpsProxyAgent;
                }
            });

            // fetch
            this.fetch(options.url, signedOptions)
                .then(async function(_response) {
                    // pass back result in correct format (json or stream, plaintext?) responseType
                    response = _response;

                    var data;
                    if (options.responseType === "stream")
                    {
                        if (response.body)
                        {
                            data = response.body;
                        }
                        else
                        {
                            data = null;
                        }
                    }
                    else
                    {
                        data = await response.text();
                        try {
                            data = JSON.parse(data);
                        }
                        catch (e) {
                            // not json, swallow
                        }
                    }
                    

                    if (!response.ok)
                    {
                        err = {
                            "status": response.status,
                            "response": data
                        }
                    }

                    return data;
                })
                .catch(function(_err) {
                    err = _err;
                })
                .then(function(data) {
                    // Always executed
                    stats.endTime = Helper.now();
                    stats.executionTime = stats.endTime - stats.startTime;

                    callback(err, response, data, stats);
                });
        };

        this.isNotFound = function(err, response) {
            return err ? (err.status === 404) : false;
        }

        this.isInvalidAccessToken = function(err, response, body)
        {
            // {"error":"invalid_token","error_description":"Invalid access token: 06ef574a-d177-4ba9-ac4b-5a57555a3a8d"}
            if (err && err.status === 401)
            {
                return (err.response ? err.response.error === "invalid_token" : false);
            }

            return false;
        };

        // @abstract
        this.buildGetHandler = function(uri, params, headers)
        {
            var self = this;

            return function(done)
            {
                var options = {
                    "method": "GET",
                    "url": uri,
                    "headers": {},
                    "params": {}
                };

                if (params)
                {
                    for (var k in params)
                    {
                        options.params[k] = params[k];
                    }
                }

                if (headers)
                {
                    for (var k in headers)
                    {
                        options.headers[k] = headers[k];
                    }
                }

                self.request(options, function(err, response, data, stats) {

                    if (self.isNotFound(err, response))
                    {
                        return done(null, null);
                    }
                    else if (err) {
                        return done(err);
                    }
                    else if (response.status >= 200 && response.status <= 204)
                    {
                        return done(null, data);
                    }

                    return done({
                        "code": response.status
                    });
                });
            }
        };

        // @abstract
        this.buildPostHandler = function(uri, params, payload, headers)
        {
            var self = this;

            return function(done)
            {
                var options = {
                    "method": "POST",
                    "url": uri,
                    "headers": {},
                    "params": {}
                };

                if (params)
                {
                    for (var k in params)
                    {
                        var v = params[k];

                        if (Helper.isObject(v))
                        {
                            v = JSON.stringify(v);
                        }

                        options.params[k] = v;
                    }
                }

                if (payload)
                {
                    options.headers["Content-Type"] = "application/json";
                    options.body = JSON.stringify(payload);
                    // options.body = payload;
                }

                if (headers)
                {
                    for (var k in headers)
                    {
                        options.headers[k] = headers[k];
                    }
                }
                self.request(options, function(err, response, data, stats) {

                    if (err) {
                        return done(err);
                    }

                    if (self.isInvalidAccessToken(err, response, data))
                    {
                        return self.handleRefreshAccessToken.call(self, err, response, data, done);
                    }

                    done(null, self.outgoing(data));
                });
            }
        };

        // @abstract
        this.buildPutHandler = function(uri, params, payload)
        {
            var self = this;

            return function(done)
            {
                var options = {
                    "method": "PUT",
                    "url": uri,
                    "headers": {},
                    "params": {}
                };

                if (params)
                {
                    for (var k in params)
                    {
                        options.params[k] = params[k];
                    }
                }

                if (payload)
                {
                    options.headers["Content-Type"] = "application/json";
                    options.body = JSON.stringify(payload);
                }

                if (headers)
                {
                    for (var k in headers)
                    {
                        options.headers[k] = headers[k];
                    }
                }

                self.request(options, function(err, response, data, stats) {

                    if (err) {
                        return done(err);
                    }

                    if (self.isInvalidAccessToken(err, response, data))
                    {
                        return self.handleRefreshAccessToken.call(self, err, response, data, done);
                    }

                    done(null, self.outgoing(data));
                });
            }
        };

        // @abstract
        this.buildDeleteHandler = function(uri, params, headers)
        {
            var self = this;

            return function(done)
            {
                var options = {
                    "method": "DELETE",
                    "url": uri,
                    "headers": {},
                    "params": {}
                };

                if (params)
                {
                    for (var k in params)
                    {
                        options.params[k] = params[k];
                    }
                }

                if (headers)
                {
                    for (var k in headers)
                    {
                        options.headers[k] = headers[k];
                    }
                }

                self.request(options, function(err, response, data, stats) {

                    if (err) {
                        return done(err);
                    }

                    if (self.isInvalidAccessToken(err, response, data))
                    {
                        return self.handleRefreshAccessToken.call(self, err, response, data, done);
                    }

                    done(null, self.outgoing(data));
                });
            }
        };

        // @abstract
        this.buildPatchHandler = function(uri, params, payload, headers)
        {
            var self = this;

            return function(done)
            {
                var options = {
                    "method": "PATCH",
                    "url": uri,
                    "headers": {},
                    "params": {}
                };

                if (params)
                {
                    for (var k in params)
                    {
                        options.params[k] = params[k];
                    }
                }

                if (payload)
                {
                    options.headers["Content-Type"] = "application/json";
                    options.body = JSON.stringify(data);
                }

                if (headers)
                {
                    for (var k in headers)
                    {
                        options.headers[k] = headers[k];
                    }
                }

                self.request(options, function(err, response, data, stats) {

                    if (err) {
                        return done(err);
                    }

                    if (self.isInvalidAccessToken(err, response, data))
                    {
                        return self.handleRefreshAccessToken.call(self, err, response, data, done);
                    }

                    done(null, self.outgoing(data));
                });
            }
        };

        // This is the bit that still isn't working!
        this.buildMultipartPostHandler = function(uri, params, payload, headers)
        {
            var self = this;

            return function(done)
            {
                var formHeaders = payload.getHeaders();

                var options = {
                    "method": "POST",
                    "url": uri,
                    "headers": {
                        // 'Content-Type': 'multipart/form-data',
                    },
                    "params": {}
                };

                if (params)
                {
                    for (var k in params)
                    {
                        var v = params[k];

                        if (Helper.isObject(v))
                        {
                            v = JSON.stringify(v);
                        }

                        options.params[k] = v;
                    }
                }

                if (payload)
                {
                    options.body = payload;
                }

                if (headers)
                {
                    for (var k in headers)
                    {
                        options.headers[k] = headers[k];
                    }
                }

                self.request(options, function(err, response, data, stats) {

                    if (err) {
                        return done(err);
                    }

                    if (self.isInvalidAccessToken(err, response, data))
                    {
                        return self.handleRefreshAccessToken.call(self, err, response, data, done);
                    }

                    done(null, self.outgoing(data));
                });
            }
        },

        // @abstract
        this.buildDownloadHandler = function(uri, params, headers)
        {
            var self = this;

            return function(done)
            {
                var options = {
                    "method": "GET",
                    "url": uri,
                    "responseType": "stream", // this is what allows axios to download a binary as a stream
                    "headers": {},
                    "params": {}
                };

                if (params)
                {
                    for (var k in params)
                    {
                        options.params[k] = params[k];
                    }
                }

                if (headers)
                {
                    for (var k in headers)
                    {
                        options.headers[k] = headers[k];
                    }
                }

                self.request(options, function(err, response, data, stats) {
                    if (self.isNotFound(err, response))
                    {
                        return done(null, null);
                    }
                    else if (err) {
                        return done(err);
                    }
                    else if (response.status >= 200 && response.status <= 204)
                    {
                        return done(null, data);
                    }

                    return done({
                        "code": response.status
                    });
                });
            }
        };

        this.buildGetRefreshToken = function()
        {
            var self = this;

            return function(refreshToken, optionalScopes)
            {
                return new Promise(function(resolve, reject) {

                    var url = [config.baseURL, "oauth/token"].join("/");
                    var clientKey = config.clientKey;
                    var clientSecret = config.clientSecret;

                    if (!optionalScopes || optionalScopes.length === 0) {
                        optionalScopes = "api";
                    }
                    var scopes = optionalScopes.join(",");

                    var params = {
                        "grant_type": "refresh_token",
                        "refresh_token": refreshToken,
                        "scope": scopes
                    };

                    var headers = {
                        "Authorization": "Basic " + Buffer.from(clientKey + ":" + clientSecret, "utf-8").toString("base64")
                    };

                    self.doRequest({
                        "url": url,
                        "method": "POST",
                        "params": params,
                        "headers": headers
                    }, function(err, response, data, stats) {

                        if (err) {
                            return reject(err);
                        }

                        resolve(data);
                    });
                });
            };
        };

        this.buildGetOwnerCredentials = function()
        {
            var self = this;

            return function(username, password, optionalScopes)
            {
                return new Promise(function(resolve, reject) {

                    var url = [config.baseURL, "oauth/token"].join("/");
                    var clientKey = config.clientKey;
                    var clientSecret = config.clientSecret;

                    if (!optionalScopes || optionalScopes.length === 0) {
                        optionalScopes = "api";
                    }
                    var scopes = optionalScopes.join(",");

                    var params = {
                        "grant_type": "password",
                        "username": username,
                        "password": password,
                        "scope": scopes
                    };

                    var headers = {
                        "Authorization": "Basic " + Buffer.from(clientKey + ":" + clientSecret, "utf-8").toString("base64")
                    };

                    self.doRequest({
                        "url": url,
                        "method": "POST",
                        "params": params,
                        "headers": headers
                    }, function(err, response, data, stats) {

                        if (err) {
                            return reject(err);
                        }

                        resolve(data);
                    });
                });
            };
        };
    }
}

module.exports = FetchEngine;
