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
         * Reads an agent (sidekick).
         *
         * @param agent
         * @returns {*}
         */
        readAgent(agent)
        {
            var agentId = this.acquireId(agent);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {};

            return this.get("/sidekicks/" + agentId, qs, callback);
        }

        /**
         * Queries for agents (sidekicks).
         *
         * @param query
         * @param pagination
         * @returns {*}
         */
        queryAgents(query, pagination)
        {
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/sidekicks/query", pagination, query, callback);
        }

        /**
         * Creates an agent (sidekick).
         *
         * @param obj
         * @returns {*}
         */
        createAgent(obj)
        {
            var callback = this.extractOptionalCallback(arguments);

            var qs = {};

            return this.post("/sidekicks", qs, obj, callback);
        }

        /**
         * Deletes an agent (sidekick).
         *
         * @param agent
         * @returns {*}
         */
        deleteAgent(agent)
        {
            var agentId = this.acquireId(agent);
            var callback = this.extractOptionalCallback(arguments);

            return this.del("/sidekicks/" + agentId, {}, callback);
        }

        /**
         * Updates an agent.
         *
         * @param agent
         * @returns {*}
         */
        updateAgent(agent)
        {
            var agentId = this.acquireId(agent);
            var callback = this.extractOptionalCallback(arguments);

            return this.put("/sidekicks/" + agentId, {}, agent, callback);
        }



        ////////////////////

        /**
         * Opens an agent session
         *
         * @param obj
         * @returns {*}
         */
        openAgentSession(obj)
        {
            var callback = this.extractOptionalCallback(arguments);

            var qs = {};

            return this.post("/oneteam/sidekicks/session/open", qs, obj, callback);
        }

        /**
         * Sends a request to an agent session.
         *
         * @param agentSession
         * @param obj
         * @returns {*}
         */
        startAgentSessionRequest(agentSession, obj)
        {
            var agentSessionId = this.acquireId(agentSession);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {};

            return this.post("/oneteam/sidekicks/sessions/" + agentSessionId + "/request", qs, obj, callback);
        }

        /**
         * Reads an agent session message
         *
         * @param agentSession
         * @param agentMessageId
         *
         * @returns {*}
         */
        readAgentSessionMessage(agentSession, agentMessageId)
        {
            var agentSessionId = this.acquireId(agentSession);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {};

            return this.get("/oneteam/sidekicks/sessions/" + agentSessionId + "/messages/" + agentMessageId, qs, callback);
        }
    }

    return SidekickSession;
};