var sessionExtensions = [];

var storageClasses = {};
var driverClasses = {};

module.exports = {

    session: function(name, fn, options)
    {
        if (name && fn)
        {
            for (var i = 0; i < sessionExtensions.length; i++)
            {
                if (sessionExtensions[i].name === name)
                {
                    throw new Error("The session extension: " + name + " is already registered");
                }
            }

            var entry = {
                "name": name,
                "fn": fn
            };
            if (options && options.core)
            {
                entry.core = options.core;
            }

            sessionExtensions.push(entry);
        }

        // sort so that "core" comes first
        sessionExtensions.sort(function(a, b) {
            if (a.core) {
                return -1;
            }
            if (b.core) {
                return 1;
            }

            return 0;
        });

        return sessionExtensions;
    },

    storage: function(name, storageClass)
    {
        if (storageClass)
        {
            storageClasses[name] = storageClass;
        }

        return storageClasses[name];
    },

    driver: function(name, driverClass)
    {
        if (driverClass)
        {
            driverClasses[name] = driverClass;
        }

        return driverClasses[name];
    }
};