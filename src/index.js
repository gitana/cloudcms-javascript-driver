const fs = require("fs");
const path = require("path");

var Helper = require("./helper");

var _infoLog = function(text)
{
    console.info(text);
};

var DEFAULT_CONFIG = {
    "baseURL": "https://api.cloudcms.com"
};

var _connect = function(config, _storageClass, _driverClass, _sessionClass, callback)
{
    _authenticate(config, function(err, credentials) {

        if (err) {
            return callback(err);
        }

        if (!_driverClass)
        {
            _driverClass = require("./drivers/request/driver");
        }

        if (!_storageClass)
        {
            _storageClass = require("./storage/memory/storage");
        }

        if (!_sessionClass)
        {
            _sessionClass = require("./session/default/session");
        }

        // instantiate the storage
        var storage = new _storageClass(config);

        // instantiate the driver
        var driver = new _driverClass(config, credentials, storage);

        // instantiate the session
        var session = new _sessionClass(config, driver, storage);

        // hand it back
        callback(null, session);
    });

};

/**
 * Authenticates using the supplied configuration.
 *
 * Authorization Code flow:
 *
 *   {
 *     "code": "<code>",
 *     "redirectUri": "<redirectUri>"
 *   }

 * Username/password flow:
 *
 *   {
 *     "username": "<username>",
 *     "password": "<password>"
 *   }
 *
 * An authentication failure handler can be passed as the final argument
 *
 * @chained platform
 *
 * @param {Object} config
 * @param [Function] callback
 */
var _authenticate = function(config, callback)
{
    var authConfig = {
        clientId: config.clientKey,
        clientSecret: config.clientSecret,
        accessTokenUri: [config.baseURL, "oauth/token"].join("/"),
        //authorizationUri: [config.baseURL, "oauth/authorize"].join("/"),
        //redirectUri: 'http://example.com/auth/github/callback',
        authorizationGrants: ['owner'],
        scopes: "api"
    };

    /*
    if (config.code && config.redirectUri)
    {
        authConfig.redirectUri = config.redirectUri;
    }
    */

    var ClientOAuth2 = require("client-oauth2");
    var auth = new ClientOAuth2(authConfig);

    auth.owner.getToken(config.username, config.password).then(function(token) {

        var accessToken = token.accessToken; // cd452036-dea1-4775-84b6-88dd374f1c13
        var tokenType = token.tokenType; // bearer
        var refreshToken = token.refreshToken; // 1c66821e-cf16-4002-ab9a-9ff7ebefc10b
        var expires = token.expires; // Thu Aug 29 2019 13:50:45 GMT-0400 (EDT)

        var credentials = function(token) {
            return {
                "accessToken": accessToken,
                "refreshToken": refreshToken,
                "tokenType": tokenType,
                "expires": expires,
                "sign": function(reqObj) {
                    return token.sign(reqObj);
                },
                "refresh": function() {
                    return token.refresh();
                }
            };
        }(token);

        callback(null, credentials);
    }).catch(function(err) {
        callback(err);
    });
};

var factory = function()
{
    ////////////////////////////////////////////////////////////////////////////////////////
    //
    // get on with it...
    //

    var isString = Helper.isString;
    var isFunction = Helper.isFunction;
    var deleteCookie = Helper.deleteCookie;

    // LOADED_CONFIG
    var LOADED_CONFIG = null;
    if (!LOADED_CONFIG) {
        var configFilePath = path.resolve(path.join(".", "gitana.json"));
        if (fs.existsSync(configFilePath)) {
            LOADED_CONFIG = JSON.parse(fs.readFileSync(configFilePath));
        }
    }
    if (!LOADED_CONFIG) {
        var configFilePath = path.resolve(path.join(".", "gitana-test.json"));
        if (fs.existsSync(configFilePath)) {
            LOADED_CONFIG = JSON.parse(fs.readFileSync(configFilePath));
        }
    }
    if (!LOADED_CONFIG) {
        var configFilePath = path.resolve(path.join(".", "cloudcms.json"));
        if (fs.existsSync(configFilePath)) {
            LOADED_CONFIG = JSON.parse(fs.readFileSync(configFilePath));
        }
    }
    if (!LOADED_CONFIG) {
        var configFilePath = path.resolve(path.join(".", "cloudcms-test.json"));
        if (fs.existsSync(configFilePath)) {
            LOADED_CONFIG = JSON.parse(fs.readFileSync(configFilePath));
        }
    }

    var exports = {};

    // defaults
    exports.defaults = {};
    exports.defaults.qs = {};
    exports.defaults.qs.full = true;
    exports.defaults.qs.metadata = true;

    var _sessionClass = null;
    exports.session = function(sessionClass)
    {
        _sessionClass = sessionClass;
    };

    var _driverClass = null;
    exports.driver = function(driverClass)
    {
        _driverClass = driverClass;
    };

    var _storageClass = null;
    exports.storage = function(storageClass)
    {
        _storageClass = storageClass;
    };

    // connect method
    exports.connect = function(connectConfig, callback)
    {
        if (typeof(connectConfig) === "function")
        {
            callback = connectConfig;
            connectConfig = {};
        }

        var fn = function(connectConfig)
        {
            return function(done) {

                var config = Helper.mergeConfigs(DEFAULT_CONFIG, LOADED_CONFIG, connectConfig);

                _connect(config, _storageClass, _driverClass, _sessionClass, function(err, session) {

                    if (err) {
                        return done(err);
                    }

                    done(null, session);
                });

            }
        }(connectConfig);

        // support "callback" if supplied
        if (callback)
        {
            return fn(function(err, session) {
                callback(err, session);
            });
        }

        // otherwise use a promise
        var promise = new Promise((resolve, reject) => {

            fn(function(err, session) {
                if (err) {
                    return reject(err);
                }

                resolve(session);
            });

        });

        return promise;
    };

    return exports;
};

module.exports = factory();