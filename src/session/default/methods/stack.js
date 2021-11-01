module.exports = function(Session)
{
    const Stack = require("../../../objects/Stack");
    const Application = require("../../../objects/Application");
    const Repository = require("../../../objects/Repository");
    const Domain = require("../../../objects/Domain");

    const wrapDataStore = (session, obj) => {
        // Make sure _doc reflects API value
        obj._stackKey = obj._doc;
        obj._doc = obj.datastoreId;

        if (!obj.datastoreTypeId)
        {
            return obj;
        }
        else if (obj.datastoreTypeId === "repository")
        {
            return new Repository(session, obj);
        }
        else if (obj.datastoreTypeId === "application")
        {
            return new Application(session, obj);
        }
        else if (obj.datastoreTypeId === "domain")
        {
            return new Domain(session, obj);
        }
        else
        {
            return obj;
        }
    }

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
        async listDataStores(stack)
        {
            var stackId = this.acquireId(stack);
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.get("/stacks/" + stackId + "/datastores", {}, callback);
            result.rows = result.rows.map(dataStore => wrapDataStore(this, dataStore));
            return result;
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
        async queryDataStores(stack, query, pagination)
        {
            var stackId = this.acquireId(stack);
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.post("/stacks/" + stackId + "/datastores/query", pagination, query, callback);
            result.rows = result.rows.map(dataStore => wrapDataStore(this, dataStore));
            return result;
        }

        async readDataStore(stack, key)
        {
            var stackId = this.acquireId(stack);
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.get("/stacks/" + stackId + "/datastores/" + key, {}, callback);
            return wrapDataStore(this, result);
        }

        async findDataStoreStack(dataStore, dataStoreType)
        {
            var dataStoreId = this.acquireId(dataStore);
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.get("/stacks/find/" + dataStoreType + "/" + dataStoreId, {}, callback);
            return new Stack(this, result);
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
