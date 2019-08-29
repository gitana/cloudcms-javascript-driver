var Driver = require("../driver");
var request = require("request");

var Helper = require("../helper");

class RequestDriver extends Driver
{
    constructor(config, credentials, storage)
    {
        super(config, credentials, storage);
    }

    get(uri, qs)
    {
        var promise = new Promise((resolve, reject) => {

            var options = {
                "method": "GET",
                "url": uri,
                "headers": {},
                "qs": {}
            };

            if (qs) {
                for (var k in qs) {
                    options.qs[k] = qs[k];
                }
            }

            var signedOptions = this.incoming(options);

            request(signedOptions, function(err, response, body) {

                if (err) {
                    return reject(err);
                }

                resolve(Helper.parseJson(body));
            });
        });

        return promise;
    }

    post(uri, qs, payload)
    {
        var promise = new Promise((resolve, reject) => {

            var options = {
                "method": "POST",
                "url": uri,
                "headers": {},
                "qs": {}
            };

            if (qs) {
                for (var k in qs) {
                    options.qs[k] = qs[k];
                }
            }

            if (payload) {
                options.headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(payload);
            }

            var signedOptions = this.incoming(options);

            request(signedOptions, function(err, response, body) {

                if (err) {
                    return reject(err);
                }

                resolve(Helper.parseJson(body));
            });
        });

        return promise;
    }

    put(uri, qs, payload)
    {
        var promise = new Promise((resolve, reject) => {

            var options = {
                "method": "PUT",
                "url": uri,
                "headers": {},
                "qs": {}
            };

            if (qs) {
                for (var k in qs) {
                    options.qs[k] = qs[k];
                }
            }

            if (payload) {
                options.headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(payload);
            }

            var signedOptions = this.incoming(options);

            request(signedOptions, function(err, response, body) {

                if (err) {
                    return reject(err);
                }

                resolve(Helper.parseJson(body));
            });
        });

        return promise;
    }

    del(uri, params)
    {
        /*
        var promise = new Promise((resolve, reject) => {

            var options = {
                "method": "DELETE",
                "url": uri,
                "headers": {},
                "qs": {}
            };

            if (qs) {
                for (var k in qs) {
                    options.qs[k] = qs[k];
                }
            }

            var signedOptions = this.incoming(options);

            request(signedOptions, function(err, response, body) {

                if (err) {
                    return reject(err);
                }

                resolve(Helper.parseJson(body));
            });
        });

        return promise;
        */
    }

    multipartPost(uri, parts)
    {

    }
}

module.exports = RequestDriver;
