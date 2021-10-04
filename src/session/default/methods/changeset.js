module.exports = function(Session)
{
    var Helper = require("../../../helper");
    var FormData = require("form-data");

    class ChangesetSession extends Session
    {
        /**
         * Reads a changeset.
         *
         * @param repository
         * @param changesetId
         * @returns {*}
         */
        readChangeset(repository, changeset)
        {
            var repositoryId = this.acquireId(repository);
            var changesetId = this.acquireId(changeset);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/repositories/" + repositoryId + "/changesets/" + changesetId, {}, callback);
        }

        queryChangesets(repository, query, pagination)
        {
            var repositoryId = this.acquireId(repository);
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/repositories/" + repositoryId + "/changesets/query", pagination, query, callback);
        }

        listChangesets(repository, pagination)
        {
            var repositoryId = this.acquireId(repository);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/repositories/" + repositoryId + "/changesets", pagination, callback);
        }

        listChangesetNodes(repository, changeset, pagination)
        {
            var repositoryId = this.acquireId(repository);
            var changesetId = this.acquireId(changeset);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/repositories/" + repositoryId + "/changesets/" + changesetId + "/nodes", pagination, callback)
        }


    }

    return ChangesetSession;
};