var Engine = require("../../engine");
var Helper = require("../../helper");

var axios = require('axios');

const { HttpsProxyAgent} = require("https-proxy-agent");
const { HttpProxyAgent} = require("http-proxy-agent");

var { ownerCredentials, refreshToken } = require("axios-oauth-client");

class AxiosEngine extends Engine
{
    constructor(config, credentials, storage, options)
    {
        super(config, credentials, storage, options);

        var self = this;


        //////////////////////////////////////////////////////////////////
        //
        // AXIOS CLIENT CONFIG
        //
        var axiosClientConfig = {};

        // copy (optional) options into client config
        if (options) {
            for (var k in options) {
                axiosClientConfig[k] = options[k];
            }
        }

        if (process.env.HTTP_PROXY) {
            axiosClientConfig.proxy = false;
            axiosClientConfig.httpAgent = new HttpProxyAgent(process.env.HTTP_PROXY);
        }

        if (process.env.HTTPS_PROXY) {
            axiosClientConfig.proxy = false;
            axiosClientConfig.httpsAgent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
        }

        // build axios client
        var client = self.client = axios.create(axiosClientConfig);


        ////

        this.doRequest = function(options, callback)
        {
            var stats = {};
            stats.startTime = Helper.now();
        
            var response = null;
            var err = null;

            var signedOptions = self.incoming(options);
            return client.request(signedOptions)
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
        }

        this.buildGetRefreshToken = function()
        {
            return refreshToken(client, [config.baseURL, "oauth/token"].join("/"), config.clientKey, config.clientSecret);
        };

        this.buildGetOwnerCredentials = function()
        {
            return ownerCredentials(client, [config.baseURL, "oauth/token"].join("/"), config.clientKey, config.clientSecret);
        };
    }
}

module.exports = AxiosEngine;
