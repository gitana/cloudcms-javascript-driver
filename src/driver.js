class Driver
{
    constructor(config, credentials, storage)
    {
        this.config = config;
        this.credentials = credentials;
        this.storage = storage;

        this.incoming = function(requestObject)
        {
            // make sure the URL isn't relative
            if (requestObject["url"].indexOf("http://") === 0 || requestObject["url"].indexOf("https://") === 0) {
                // ok
            } else {
                requestObject["url"] = [this.config.baseURL, requestObject["url"]].join("/");
            }

            // sign the request
            requestObject = credentials.sign(requestObject);

            // hand it back
            return requestObject;
        }
    }

    /**
     * @extension_point
     *
     * @param uri
     * @param params
     */
    get(uri, params)
    {

    }

    /**
     * @extension_point
     *
     * @param uri
     * @param params
     * @param payload
     */
    post(uri, params, payload)
    {

    }

    /**
     * @extension_point
     *
     * @param uri
     * @param params
     * @param payload
     */
    put(uri, params, payload)
    {

    }

    /**
     * @extension_point
     *
     * @param uri
     * @param params
     */
    del(uri, params)
    {

    }

    /**
     * requestObject
     *
     * @param uri
     * @param parts
     */
    multipartPost(uri, parts)
    {

    }
}

module.exports = Driver;
