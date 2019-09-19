var Driver = require("../../driver");
var request = require("request");

var Helper = require("../../helper");

var doRequest = function(options, callback)
{
    var stats = {};
    stats.startTime = Helper.now();

    request(options, function(err, response, body) {
        stats.endTime = Helper.now();
        stats.executionTime = stats.endTime - stats.startTime;

        // console.log("[" + options.method + " " + options.url + "](" + stats.executionTime + " ms)");

        callback(err, response, body, stats);
    });
};

class RequestDriver extends Driver
{
    constructor(config, credentials, storage)
    {
        super(config, credentials, storage);

        // @abstract
        this.buildGetHandler = function(uri, qs)
        {
            var self = this;

            return function(done)
            {
                var options = {
                    "method": "GET",
                    "url": uri,
                    "headers": {},
                    "qs": {}
                };

                if (qs)
                {
                    for (var k in qs)
                    {
                        options.qs[k] = qs[k];
                    }
                }

                var signedOptions = self.incoming(options);

                doRequest(signedOptions, function(err, response, body, stats) {

                    if (err) {
                        return done(err);
                    }

                    if (response.statusCode === 404)
                    {
                        return done();
                    }
                    else if (response.statusCode >= 200 && response.statusCode <= 204)
                    {
                        if (response.headers['content-type'].toLowerCase().includes('text/plain'))
                        {
                            return done(null, body);
                        }
                        else
                        {
                            return done(null, Helper.parseJson(body));
                        }
                    }

                    return done(self.outgoing(body));
                });
            }
        };

        // @abstract
        this.buildPostHandler = function(uri, qs, payload)
        {
            var self = this;

            return function(done)
            {
                var options = {
                    "method": "POST",
                    "url": uri,
                    "headers": {},
                    "qs": {}
                };

                if (qs)
                {
                    for (var k in qs)
                    {
                        var v = qs[k];

                        if (Helper.isObject(v))
                        {
                            v = JSON.stringify(v);
                        }

                        options.qs[k] = v;
                    }
                }

                if (payload)
                {
                    options.headers["Content-Type"] = "application/json";
                    //options.body = JSON.stringify(payload);
                    options.json = payload;
                }

                var signedOptions = self.incoming(options);

                doRequest(signedOptions, function(err, response, body, stats) {

                    if (err) {
                        return done(err);
                    }

                    done(null, self.outgoing(body));
                });
            }
        };

        // @abstract
        this.buildPutHandler = function(uri, qs, payload)
        {
            var self = this;

            return function(done)
            {
                var options = {
                    "method": "PUT",
                    "url": uri,
                    "headers": {},
                    "qs": {}
                };

                if (qs)
                {
                    for (var k in qs)
                    {
                        options.qs[k] = qs[k];
                    }
                }

                if (payload)
                {
                    options.headers["Content-Type"] = "application/json";
                    options.body = JSON.stringify(payload);
                }

                var signedOptions = self.incoming(options);

                doRequest(signedOptions, function(err, response, body, stats) {

                    if (err) {
                        return done(err);
                    }

                    done(null, self.outgoing(body));
                });
            }
        };

        // @abstract
        this.buildDelHandler = function(uri, qs)
        {
            var self = this;

            return function(done)
            {
                var options = {
                    "method": "DELETE",
                    "url": uri,
                    "headers": {},
                    "qs": {}
                };

                if (qs)
                {
                    for (var k in qs)
                    {
                        options.qs[k] = qs[k];
                    }
                }

                var signedOptions = self.incoming(options);

                doRequest(signedOptions, function(err, response, body, stats) {

                    if (err) {
                        return done(err);
                    }

                    done(null, self.outgoing(body));
                });

            }
        };

        // @abstract
        this.buildPatchHandler = function(uri, qs, payload)
        {
            var self = this;

            return function(done)
            {
                var options = {
                    "method": "PATCH",
                    "url": uri,
                    "headers": {},
                    "qs": {}
                };

                if (qs)
                {
                    for (var k in qs)
                    {
                        options.qs[k] = qs[k];
                    }
                }

                if (payload)
                {
                    options.headers["Content-Type"] = "application/json";
                    options.body = JSON.stringify(payload);
                }

                var signedOptions = self.incoming(options);

                doRequest(signedOptions, function(err, response, body, stats) {

                    if (err) {
                        return done(err);
                    }

                    done(null, self.outgoing(body));
                });
            }
        };
    }
}

module.exports = RequestDriver;
