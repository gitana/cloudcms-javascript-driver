module.exports = function(Session)
{
    const Stack = require("../objects/Stack");

    class StackSession extends Session
    {
        /**
         * Reads an Stack.
         *
         * @param stack
         * @returns {*}
         */
        async readStack(stack)
        {
            var stackId = this.acquireId(stack);
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.get("/stacks/" + stackId, {}, callback);
            return new Stack(this, result);
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

            return this.post("/stacks/" + stackId + "/datastores/query", pagination, query, callback);
        }

        readDataStore(stack, key)
        {
            var stackId = this.acquireId(stack);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/stacks/" + stackId + "/datastores/" + key, {}, callback);
        }

        findDataStoreStack(dataStore, dataStoreType)
        {
            var dataStoreId = this.acquireId(dataStore);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/stacks/find/" + dataStoreType + "/" + dataStoreId, {}, callback);
        }

        assignDataStore(stack, dataStore, dataStoreType, key)
        {
            var stackId = this.acquireId(stack);
            var dataStoreId = this.acquireId(dataStore);
            var callback = this.extractOptionalCallback(arguments);

            var params = {
                "type": dataStoreType,
                "id": dataStoreId,
                "key": key
            };

            return this.post("/stacks/" + stackId + "/datastores/assign", params, callback);
        }

        unassignDataStore(stack, key)
        {
            var stackId = this.acquireId(stack);
            var callback = this.extractOptionalCallback(arguments);

            var params = {
                "key": key
            };

            return this.post("/stacks/" + stackId + "/datastores/unassign", params, callback);
        }

    }

    return StackSession;
};
