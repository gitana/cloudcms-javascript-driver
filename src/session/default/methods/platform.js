module.exports = function(Session)
{
    class PlatformSession extends Session
    {
        readPlatform()
        {
            var callback = this.extractOptionalCallback(arguments);
            return this.get("/", {}, callback);
        }
    }

    return PlatformSession;
};
