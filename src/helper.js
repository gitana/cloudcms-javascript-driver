var exports = module.exports = {};

var isString = exports.isString = function(thing)
{
    return (typeof(thing) === "string");
};

var isObject = exports.isObject = function(thing)
{
    return (thing !== null && typeof thing === 'object');
};

var isArray = exports.isArray = function(thing)
{
    return Array.isArray(thing);
};

var isFunction = exports.isFunction = function(thing)
{
    return (typeof(thing) === "function");
};

var escape = exports.escape = function(text)
{
    if (text) {
        text = encodeURIComponent(text);
    }

    return text;
};

var toQueryString = exports.toQueryString = function(params)
{
    var queryString = "";

    if (params)
    {
        for (var k in params)
        {
            if (queryString.length > 0)
            {
                queryString += "&";
            }

            var val = null;
            if (params[k])
            {
                val = params[k];

                // url encode
                val = urlEncode(val);
            }

            if (val)
            {
                queryString += k + "=" + val;
            }
        }
    }

    return queryString;
};

var urlEncode = exports.urlEncode = function(val)
{
    function hex(code) {
        var hex = code.toString(16).toUpperCase();
        if (hex.length < 2) {
            hex = 0 + hex;
        }
        return '%' + hex;
    }

    if (!string) {
        return '';
    }

    string = string + '';
    var reserved_chars = /[ \r\n!*"'();:@&=+$,\/?%#\[\]<>{}|`^\\\u0080-\uffff]/,
        str_len = string.length, i, string_arr = string.split(''), c;

    for (i = 0; i < str_len; i++)
    {
        c = string_arr[i].match(reserved_chars);
        if (c)
        {
            c = c[0].charCodeAt(0);

            if (c < 128) {
                string_arr[i] = hex(c);
            } else if (c < 2048) {
                string_arr[i] = hex(192+(c>>6)) + hex(128+(c&63));
            } else if (c < 65536) {
                string_arr[i] = hex(224+(c>>12)) + hex(128+((c>>6)&63)) + hex(128+(c&63));
            } else if (c < 2097152) {
                string_arr[i] = hex(240+(c>>18)) + hex(128+((c>>12)&63)) + hex(128+((c>>6)&63)) + hex(128+(c&63));
            }
        }
    }

    return string_arr.join('');
};

var urlDecode = exports.urlDecode = function(val)
{
    if (!val)
    {
        return '';
    }

    return val.replace(/%[a-fA-F0-9]{2}/ig, function (match) {
        return String.fromCharCode(parseInt(match.replace('%', ''), 16));
    });
};

/**
 * Determines whether the current runtime environment supports HTML5 local storage
 *
 * @return {Boolean}
 */
var supportsLocalStorage = exports.supportsLocalStorage = function()
{
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
};

/**
 * Determines whether the current runtime environment supports HTML5 session storage.
 *
 * @return {Boolean}
 */
var supportsSessionStorage = exports.supportsSessionStorage = function()
{
    try {
        return 'sessionStorage' in window && window['sessionStorage'] !== null;
    } catch (e) {
        return false;
    }
};

var safeRequire = exports.safeRequire = function(name)
{
    var x = null;
    try {
        x = require(name);
    }
    catch (e) { }
    return x;
};

/**
 * Merges multiple configuration objects together and hands back a new configuration object.
 *
 * Usage:
 *
 *    var result = merge({
 *       "a": 1,
 *       "b": 2
 *    }, {
 *       "b": 3
 *    }, {
 *       "c": 4
 *    });
 *
 *    // the result is { "a": 1, "b": 3, "c": 4 }
 *
 * @param
 * @param target
 * @returns {*}
 */
var mergeConfigs = exports.mergeConfigs = function()
{
    var obj = {};

    for (var i = 0; i < arguments.length; i++)
    {
        var source = arguments[i];
        for (var k in source)
        {
            obj[k] = source[k];
        }
    }

    return obj;
};

var parseJson = exports.parseJson = function(text)
{
    return JSON.parse("" + text);
};

var acquireId = exports.acquireId = function(objOrId)
{
    if (objOrId)
    {
        if (isString(objOrId))
        {
            return objOrId;
        }

        if (objOrId._doc)
        {
            return objOrId._doc;
        }

        if (objOrId.id)
        {
            return objOrId.id;
        }
    }

    return null;
};

var now = exports.now = function()
{
    return new Date().getTime();
};