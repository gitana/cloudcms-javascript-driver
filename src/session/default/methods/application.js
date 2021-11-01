module.exports = function(Session)
{
    const Application = require("../../../objects/Application");

    class ApplicationSession extends Session
    {
        /**
         * Reads an Application.
         *
         * @param application
         * @returns {*}
         */
        async readApplication(application)
        {
            var applicationId = this.acquireId(application);
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.get("/applications/" + applicationId, {}, callback);
            return new Application(this, result);
        }
    }

    return ApplicationSession;
};
