const fs = require("fs");
const path = require("path");

var Helper = require("./helper");

// extensions object
var extensions = require("./extensions");

// build the session that we hand back
var Session = require("./session");
module.exports = Session;

var _infoLog = function(text)
{
    console.info(text);
};


////////////////////////////////////////////////////////////////////////////////////////
//
// SESSION
//
////////////////////////////////////////////////////////////////////////////////////////

// default session methods
require("./methods/workflow");
require("./methods/repository");
require("./methods/branch");
require("./methods/node");

// process any session extension functions
var sessionExtensions = extensions.session();
for (var i = 0; i < sessionExtensions.length; i++)
{
    var extension = sessionExtensions[i];
    if (extension.fn)
    {
        if (extension.name) {
            _infoLog("Added session extension: " + extension.name);
        }

        Session = extension.fn.call(this, Session, Helper);
    }
}


////////////////////////////////////////////////////////////////////////////////////////
//
// DRIVERS
//
////////////////////////////////////////////////////////////////////////////////////////

// default drivers
require("./drivers/request");




////////////////////////////////////////////////////////////////////////////////////////
//
// STORAGE
//
////////////////////////////////////////////////////////////////////////////////////////

// default drivers
require("./storage/memory");




////////////////////////////////////////////////////////////////////////////////////////
//
// get on with it...
//

var isString = Helper.isString;
var isFunction = Helper.isFunction;
var deleteCookie = Helper.deleteCookie;

var ClientOAuth2 = require("client-oauth2");

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

var DEFAULT_CONFIG = {
    "baseURL": "https://api.cloudcms.com"
};

var exports = module.exports = {};

// defaults
exports.defaults = {};
exports.defaults.qs = {};
exports.defaults.qs.full = true;
exports.defaults.qs.metadata = true;
exports.defaults.driver = {};
exports.defaults.storage = {};
exports.defaults.storage.type = "memory";
exports.defaults.driver = {};
exports.defaults.driver.type = "request";


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

            _connect(config, function(err, session) {

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

var _connect = function(config, callback)
{
    _authenticate(config, function(err, credentials) {

        if (err) {
            return callback(err);
        }

        // configuration
        var storageName = exports.defaults.storage.type;
        if (!storageName)
        {
            storageName = "memory";
        }

        var driverName = exports.defaults.driver.type;
        if (!driverName)
        {
            driverName = "request";
        }

        var storageClass = extensions.storage(storageName);
        if (!storageClass)
        {
            throw new Error("Cannot find storage class for name: " + storageName);
        }
        _infoLog("Using storage: " + storageName);

        var driverClass = extensions.driver(driverName);
        if (!driverClass)
        {
            throw new Error("Cannot find driver class for name: " + driverName);
        }
        _infoLog("Using driver: " + driverName);

        // build storage
        var storage = new storageClass(config);

        // build driver
        var driver = new driverClass(config, credentials, storage);

        // wrap it all up into a session
        var session = new Session(config, driver, storage);

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