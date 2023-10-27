module.exports = function(Session)
{
    class PlatformSession extends Session
    {
        readPlatform()
        {
            var callback = this.extractOptionalCallback(arguments);
            return this.get("/", {}, callback);
        }

        readAuthInfo()
        {
            var callback = this.extractOptionalCallback(arguments);
            return this.get("/auth/info", {}, callback);
        }

        async getAuthInfo()
        {
            var callback = this.extractOptionalCallback(arguments);
            if (!this.authInfo)
            {
                this.authInfo = await this.readAuthInfo();
            }

            if (callback)
            {
                callback(this.authInfo);
            }

            return this.authInfo;
        }

        async getPlatformId()
        {
            var callback = this.extractOptionalCallback(arguments);
            var authInfo = await this.getAuthInfo();
            var platformId = authInfo.tenant.platformId;
            if (callback)
            {
                callback(platformId);
            }

            return platformId;
        }

        async buildPlatformReference()
        {
            var callback = this.extractOptionalCallback(arguments);
            var platformId = await this.getPlatformId();
            var platformRef = `platform://${platformId}`;

            if (callback)
            {
                callback(platformRef);
            }

            return platformRef;
        }
    }

    return PlatformSession;
};
