class Session
{
    constructor(config, driver, storage)
    {
        this.config = config;
        this.driver = driver;
        this.storage = storage;
    }

    get(uri, qs)
    {
        var driver = this.driver;

        var outerPromise = new Promise(function(resolve, reject) {
            var innerPromise = driver.get(uri, qs);
            innerPromise.then(function(response) {

                //console.log("INNER PROMISE RESOLVE!");

                resolve(response);
            });
        });

        return outerPromise;
    }

    post(uri, qs, payload)
    {
        return this.driver.post(uri, qs, payload);
    }

    put(uri, qs, payload)
    {
        return this.driver.put(uri, qs, payload);
    }

    del(uri, qs)
    {
        return this.driver.del(uri, qs);
    }

    multipartPost(uri, parts)
    {
        return this.driver.multipartPost(uri, parts);
    }
};

module.exports = Session;