module.exports = function(Session)
{
    class StackSession extends Session
    {
        /**
         * Reads an Stack.
         *
         * @param stack
         * @returns {*}
         */
        readStack(stack)
        {
            var stackId = this.acquireId(stack);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/stacks/" + stackId, {}, callback);
        }

        /**
         * Reads an DataStore.
         *
         * @param stack
         * @returns {*}
         */
        listDataStores(stack)
        {
            var stackId = this.acquireId(stack);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/stacks/" + stackId + "/datastores", {}, callback);
        }

        /**
         * Queries for DataStores.
         *
         * @param stack
         * @param query
         * @param pagination
         *
         * @returns {*}
         */
        queryDataStores(stack, query, pagination)
        {
            var stackId = this.acquireId(stack);
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/datastores/query", pagination, query, callback);
        }

    }

    return StackSession;
};
