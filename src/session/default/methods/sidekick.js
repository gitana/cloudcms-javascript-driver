module.exports = function(Session)
{
    class SidekickSession extends Session
    {
        // async buildSidekickReference(sidekick)
        // {
        //     var sidekickId = this.acquireId(sidekick);
        //     var callback = this.extractOptionalCallback(arguments);
        //
        //     var platformId = await this.getPlatformId();
        //     var ref = `node://${platformId}/${sidekickId}`;
        //     if (callback)
        //     {
        //         callback(ref);
        //     }
        //
        //     return ref;
        // }

        /**
         * Reads an assistant (sidekick).
         *
         * @param assistant
         * @returns {*}
         */
        readAssistant(assistant)
        {
            var sidekickId = this.acquireId(assistant);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {};

            return this.get("/sidekicks/" + sidekickId, qs, callback);
        }

        /**
         * Queries for assistants (sidekicks).
         *
         * @param query
         * @param pagination
         * @returns {*}
         */
        queryAssistants(query, pagination)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/sidekicks/query", pagination, query, callback);
        }

        /**
         * Creates an assistant (sidekick).
         *
         * @param obj
         * @returns {*}
         */
        createAssistant(obj)
        {
            var callback = this.extractOptionalCallback(arguments);

            var qs = {};

            return this.post("/sidekicks", qs, obj, callback);
        }

        /**
         * Deletes an assistant (sidekick).
         *
         * @param assistant
         * @returns {*}
         */
        deleteAssistant(assistant)
        {
            var sidekickId = this.acquireId(assistant);
            var callback = this.extractOptionalCallback(arguments);

            return this.del("/sidekicks/" + sidekickId, {}, callback);
        }

        /**
         * Updates an assistant.
         *
         * @param assistant
         * @returns {*}
         */
        updateAssistant(assistant)
        {
            var sidekickId = this.acquireId(assistant);
            var callback = this.extractOptionalCallback(arguments);

            return this.put("/sidekicks/" + sidekickId, {}, assistant, callback);
        }



        ////////////////////

        /**
         * Opens an assistant session
         *
         * @param obj
         * @returns {*}
         */
        openAssistantSession(obj)
        {
            var callback = this.extractOptionalCallback(arguments);

            var qs = {};

            return this.post("/oneteam/sidekicks/session/open", qs, obj, callback);
        }

        /**
         * Sends a request to an assistant session.
         *
         * @param assistantSession
         * @param obj
         * @returns {*}
         */
        startAssistantSessionRequest(assistantSession, obj)
        {
            var assistantSessionId = this.acquireId(assistantSession);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {};

            return this.post("/oneteam/sidekicks/sessions/" + assistantSessionId + "/request", qs, obj, callback);
        }

        /**
         * Reads an assistant session message
         *
         * @param assistantSession
         * @param assistantMessageId
         *
         * @returns {*}
         */
        readAssistantSessionMessage(assistantSession, assistantMessageId)
        {
            var assistantSessionId = this.acquireId(assistantSession);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {};

            return this.get("/oneteam/sidekicks/sessions/" + assistantSessionId + "/messages/" + assistantMessageId, qs, callback);
        }
    }

    return SidekickSession;
};