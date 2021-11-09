var Driver = require("../../driver");
var Helper = require("../../helper");

// var Request = require('node-fetch').Request;

// needs to be able to accept arbitrary fetch() implementation
// Implement fetch API


class FetchDriver extends Driver
{
    constructor(config, credentials, storage)
    {
        super(config, credentials, storage);
        this.fetch = config.fetch;

        var doRequest = (options, callback) =>
        {
            var stats = {};
            stats.startTime = Helper.now();
        
            var response = null;
            var err = null;


            // parse params
            var params = new URLSearchParams(options.params);
            options.url += "?" + params.toString();

            // var request = new Request(options.url, options);

            // fetch
            this.fetch(options.url, options)
                .then(async function(_response) {
                    // pass back result in correct format (json or stream, plaintext?) responseType
                    response = _response;

                    if (!response.ok)
                    {
                        throw new Error(await response.text());
                    }

                    if (options.responseType === "stream")
                    {
                        if (response.body)
                        {
                            return response.body;
                        }
                        else
                        {
                            return null;
                        }
                    }
                    
                    var data = await response.text();
                    try {
                        data = JSON.parse(data);
                    }
                    catch (e) {
                        // not json, swallow
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

        this.isInvalidAccessToken = function(err, response, body)
        {
            var self = this;

            // {"error":"invalid_token","error_description":"Invalid access token: 06ef574a-d177-4ba9-ac4b-5a57555a3a8d"}
            if (response.status === 401)
            {
                var json = self.outgoing(body);
                return (json.error === "invalid_token");
            }

            return false;
        };

        // @abstract
        this.buildGetHandler = function(uri, params)
        {
            var self = this;

            return function(done)
            {
                // ensures that access token is valid - if not, a refresh token request is made to get a new one
                self.ensureTokenState(function(err) {

                    if (err) {
                        return done(err);
                    }

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

                    var signedOptions = self.incoming(options);

                    doRequest(signedOptions, function(err, response, data, stats) {

                        if (err) {
                            return done(err);
                        }

                        if (self.isInvalidAccessToken(err, response, data))
                        {
                            return self.handleRefreshAccessToken.call(self, err, response, data, done);
                        }

                        if (response.status === 404)
                        {
                            return done();
                        }
                        else if (response.status >= 200 && response.status <= 204)
                        {
                            return done(null, data);
                        }

                        return done({
                            "code": response.status
                        });
                    });
                });
            }
        };

        // @abstract
        this.buildPostHandler = function(uri, params, payload)
        {
            var self = this;

            return function(done)
            {
                // ensures that access token is valid - if not, a refresh token request is made to get a new one
                self.ensureTokenState(function(err) {

                    if (err) {
                        return done(err);
                    }

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

                    var signedOptions = self.incoming(options);

                    doRequest(signedOptions, function(err, response, data, stats) {

                        if (err) {
                            return done(err);
                        }

                        if (self.isInvalidAccessToken(err, response, data))
                        {
                            return self.handleRefreshAccessToken.call(self, err, response, data, done);
                        }

                        done(null, self.outgoing(data));
                    });
                });
            }
        };

        // @abstract
        this.buildPutHandler = function(uri, params, payload)
        {
            var self = this;

            return function(done)
            {
                // ensures that access token is valid - if not, a refresh token request is made to get a new one
                self.ensureTokenState(function(err) {

                    if (err) {
                        return done(err);
                    }

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

                    var signedOptions = self.incoming(options);

                    doRequest(signedOptions, function(err, response, data, stats) {

                        if (err) {
                            return done(err);
                        }

                        if (self.isInvalidAccessToken(err, response, data))
                        {
                            return self.handleRefreshAccessToken.call(self, err, response, data, done);
                        }

                        done(null, self.outgoing(data));
                    });
                });
            }
        };

        // @abstract
        this.buildDelHandler = function(uri, params)
        {
            var self = this;

            return function(done)
            {
                // ensures that access token is valid - if not, a refresh token request is made to get a new one
                self.ensureTokenState(function(err) {

                    if (err) {
                        return done(err);
                    }

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

                    var signedOptions = self.incoming(options);

                    doRequest(signedOptions, function(err, response, data, stats) {

                        if (err) {
                            return done(err);
                        }

                        if (self.isInvalidAccessToken(err, response, data))
                        {
                            return self.handleRefreshAccessToken.call(self, err, response, data, done);
                        }

                        done(null, self.outgoing(data));
                    });
                });
            }
        };

        // @abstract
        this.buildPatchHandler = function(uri, params, payload)
        {
            var self = this;

            return function(done)
            {
                // ensures that access token is valid - if not, a refresh token request is made to get a new one
                self.ensureTokenState(function(err) {

                    if (err) {
                        return done(err);
                    }

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

                    var signedOptions = self.incoming(options);

                    doRequest(signedOptions, function(err, response, data, stats) {

                        if (err) {
                            return done(err);
                        }

                        if (self.isInvalidAccessToken(err, response, data))
                        {
                            return self.handleRefreshAccessToken.call(self, err, response, data, done);
                        }

                        done(null, self.outgoing(data));
                    });
                });
            }
        };


        // This is the bit that still isn't working!
        this.buildMultipartPostHandler = function(uri, params, payload)
        {
            var self = this;

            return function(done)
            {
                // ensures that access token is valid - if not, a refresh token request is made to get a new one
                self.ensureTokenState(function(err) {

                    if (err) {
                        return done(err);
                    }

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

                    var signedOptions = self.incoming(options);

                    doRequest(signedOptions, function(err, response, data, stats) {

                        if (err) {
                            return done(err);
                        }

                        if (self.isInvalidAccessToken(err, response, data))
                        {
                            return self.handleRefreshAccessToken.call(self, err, response, data, done);
                        }

                        done(null, self.outgoing(data));
                    });
                });
            }
        },

        // @abstract
        this.buildDownloadHandler = function(uri, params)
        {
            var self = this;

            return function(done)
            {
                // ensures that access token is valid - if not, a refresh token request is made to get a new one
                self.ensureTokenState(function(err) {

                    if (err) {
                        return done(err);
                    }

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

                    var signedOptions = self.incoming(options);

                    doRequest(signedOptions, function(err, response, data, stats) {

                        if (err) {
                            return done(err);
                        }

                        if (self.isInvalidAccessToken(err, response, data))
                        {
                            return self.handleRefreshAccessToken.call(self, err, response, data, done);
                        }

                        if (response.status === 404)
                        {
                            return done();
                        }
                        else if (response.status >= 200 && response.status <= 204)
                        {
                            return done(null, data);
                        }

                        return done({
                            "code": response.status
                        });
                    });
                });
            }
        };
    }
}

module.exports = FetchDriver;
