var Driver = require("../../driver");
var Helper = require("../../helper");

var axios = require('axios');

class AxiosDriver extends Driver
{
    constructor(config, credentials, storage)
    {
        super(config, credentials, storage);

        var doRequest = function(options, callback)
        {
            var stats = {};
            stats.startTime = Helper.now();
        
            var response = null;
            var err = null;

            axios.request(options)
                .then(function(_response) {
                    response = _response;
                })
                .catch(function(_err) {
                    err = _err;
                })
                .then(function() {
                    // Always executed
                    stats.endTime = Helper.now();
                    stats.executionTime = stats.endTime - stats.startTime;

                    var data = (response && response.data) ? response.data : null;

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
                        //options.body = JSON.stringify(payload);
                        options.data = payload;
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
                        options.data = JSON.stringify(payload);
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
        this.buildPatchHandler = function(uri, qs, payload)
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
                        options.data = JSON.stringify(data);
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

        this.buildMultipartPostHandler = function(uri, params, formData)
        {
            var self = this;

            return function(done)
            {
                // ensures that access token is valid - if not, a refresh token request is made to get a new one
                self.ensureTokenState(function(err) {

                    if (err) {
                        return done(err);
                    }

                    var formHeaders = formData.getHeaders();

                    var options = {
                        "method": "POST",
                        "url": uri,
                        "headers": {
                            'Content-Type': 'multipart/form-data',
                            ...formHeaders // need to add headers from form
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

                    if (formData)
                    {
                        options.data = formData;
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

module.exports = AxiosDriver;
