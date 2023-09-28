var Driver = require("../../driver");
var Helper = require("../../helper");

var axios = require('axios');

class AxiosDriver extends Driver
{
    constructor(config, credentials, storage)
    {
        super(config, credentials, storage);
        var self = this;

        this.doRequest = this.doRequest = function(options, callback)
        {
            var stats = {};
            stats.startTime = Helper.now();
        
            var response = null;
            var err = null;

            var signedOptions = self.incoming(options);
            return axios.request(signedOptions)
                .then(function(_response) {
                    response = _response;
                })
                .catch(function(_err) {
                    err = _err;
                })
                .then(async function() {
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
            if (err) {
                response = err.response;
                body = response.data;
            }

            if (response && response.status === 401)
            {
                var json = self.outgoing(body);
                return (json.error === "invalid_token");
            }

            return false;
        };

        this.isNotFound = function(err, response) {
            if (err) {
                response = err.response;
            }

            return response ? (response.status === 404) : false;
        }

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
                    //options.body = JSON.stringify(payload);
                    options.data = payload;
                }

                self.request(options, function(err, response, data, stats) {

                    if (err) {
                        return done(err);
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
                    options.data = JSON.stringify(payload);
                }

                self.request(options, function(err, response, data, stats) {

                    if (err) {
                        return done(err);
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
                    options.data = JSON.stringify(data);
                }

                self.request(options, function(err, response, data, stats) {

                    if (err) {
                        return done(err);
                    }

                    done(null, self.outgoing(data));
                });
            }
        };

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

                if (payload)
                {
                    options.data = payload;
                }

                options.maxBodyLength = 1000000000;

                self.request(options, function(err, response, data, stats) {

                    if (err) {
                        return done(err);
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
        let result = await axios.request({method, url, data: body, headers});
        return { 
            status: result.status,
            body: JSON.stringify(result.data)
        }
    }
}

module.exports = AxiosDriver;
