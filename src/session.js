var PlatformService = require("./api/PlatformService");
var RepositoryService = require("./api/RepositoryService");

class Session
{
    constructor(config, driver, storage)
    {
        this.config = config;
        this.driver = driver;
        this.storage = storage;
    }

    // proxies

    get(uri, qs, callback)
    {
        //var driver = this.driver;

        /*
        var outerPromise = new Promise(function(resolve, reject) {
            var innerPromise = driver.get(uri, qs);
            innerPromise.then(function(response) {

                //console.log("INNER PROMISE RESOLVE!");

                resolve(response);
            });
        });

        return outerPromise;
        */

        return this.driver.get(uri, qs, callback);
    }

    post(uri, qs, payload, callback)
    {
        return this.driver.post(uri, qs, payload, callback);
    }

    put(uri, qs, payload, callback)
    {
        return this.driver.put(uri, qs, payload, callback);
    }

    del(uri, qs, callback)
    {
        return this.driver.del(uri, qs, callback);
    }

    multipartPost(uri, parts, callback)
    {
        return this.driver.multipartPost(uri, parts, callback);
    }

    // services

    platformService()
    {
        return new PlatformService(this);
    }

    repositoryService(repositoryId)
    {
        return new RepositoryService(this, repositoryId);
    }

    branchService(repositoryId, branchId)
    {
        return this.repositoryService(repositoryId).branchService(branchId);
    }

    nodeService(repositoryId, branchId, nodeId)
    {
        return this.branchService(repositoryId, branchId).nodeService(nodeId);
    }
};

module.exports = Session;