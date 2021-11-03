module.exports = function(Session)
{
    class ApplicationSession extends Session
    {
        /**
         * Reads an Application.
         *
         * @param application
         * @returns {*}
         */
        readApplication(application)
        {
            var applicationId = this.acquireId(application);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/applications/" + applicationId, {}, callback);
        }
    }

    return ApplicationSession;
};
