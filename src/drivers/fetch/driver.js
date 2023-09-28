var Driver = require("../../driver");
var Helper = require("../../helper");

class FetchDriver extends Driver
{
    constructor(config, credentials, storage)
    {
        super(config, credentials, storage);
        this.fetch = config.fetch;

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
                            data =null;
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
        this.buildGetHandler = function(uri, params)
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
        this.buildPostHandler = function(uri, params, payload)
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
        this.buildDelHandler = function(uri, params)
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
        this.buildPatchHandler = function(uri, params, payload)
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
        this.buildMultipartPostHandler = function(uri, params, payload)
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
        this.buildDownloadHandler = function(uri, params)
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
    }

    // Must return object with keys status: string and body: string
    async oauthRequest(method, url, body, headers) {
        let result = await this.fetch(url, {method, body, headers});
        let status = result.status;
        let responseBody = await result.text();
        return { status, body: responseBody };
    }
}

module.exports = FetchDriver;
