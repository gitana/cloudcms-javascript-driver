let fs = null;
try {
    fs = require("fs");
}
catch (e) {

}
const path = require("path");

var Helper = require("./helper");

var _infoLog = function(text)
{
    console.info(text);
};

var DEFAULT_CONFIG = {
    "baseURL": "https://api.cloudcms.com"
};

var _connect = function(config, _storageClass, _driverClass, _driverOptions, _sessionClass, callback)
{
    // assume axios driver class
    if (!_driverClass)
    {
        _driverClass = require("./drivers/axios/driver");
    }
    else if (_driverClass === "axios")
    {
        _driverClass = require("./drivers/axios/driver");
    }
    else if (_driverClass === "fetch")
    {
        _driverClass = require("./drivers/fetch/driver");
    }

    // assume memory storage
    if (!_storageClass)
    {
        _storageClass = require("./storage/memory/storage");
    }

    // instantiate the storage
    var storage = new _storageClass(config);

    // instantiate the driver
    var driver = new _driverClass(config, null, storage, _driverOptions);
    driver.connect(function(err) {

        if (err) {
            return callback(err);
        }

        if (!_sessionClass)
        {
            _sessionClass = require("./session/default/session");
        }

        // instantiate the session
        var session = new _sessionClass(config, driver, storage);

        // hand it back
        callback(null, session);

    })
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

    // Try to load config from local file, if available and possible
    if (fs)
    {
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
    var _driverOptions = null;
    exports.driver = function(driverClass, driverOptions)
    {
        _driverClass = driverClass;
        _driverOptions = driverOptions;
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

                _connect(config, _storageClass, _driverClass, _driverOptions, _sessionClass, function(err, session) {

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

    exports.AxiosDriver = require("./drivers/axios/driver");
    exports.FetchDriver = require("./drivers/fetch/driver");

    exports.DefaultSession = require("./session/default/session");
    exports.UtilitySession = require("./session/utility/session");

    return exports;
};

module.exports = factory();
