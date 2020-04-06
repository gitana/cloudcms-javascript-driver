module.exports = function(Session)
{
    class BranchSession extends Session
    {
        /**
         * Queries for branches.
         *
         * @param repository
         * @param query
         * @param pagination
         *
         * @returns {*}
         */
        queryBranches(repository, query, pagination)
        {
            var repositoryId = this.acquireId(repository);
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/repositories/" + repositoryId + "/branches", pagination, query, callback);
        };

        /**
         * Read a branch.
         *
         * @param repository
         * @param branch
         *
         * @returns {*}
         */
        readBranch(repository, branch)
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);

            return this.get("/repositories/" + repositoryId + "/branches/" + branchId, {}, callback);
        };

        /**
         * Create a branch.
         *
         * @param repository
         * @param branch
         * @param changesetId
         * @param branchObject
         *
         * @returns {*}
         */
        createBranch(repository, branch, changesetId, obj={})
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {
                changeset: changesetId,
                branch: branchId
            };

            return this.post("/repositories/" + repositoryId + "/branches", qs, obj, callback);
        };

        /**
         * List branches.
         *
         * @param repository
         *
         * @returns {*}
         */
        listBranches(repository)
        {
            var repositoryId = this.acquireId(repository);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {
                full: true
            };

            return this.get("/repositories/" + repositoryId + "/branches", qs, callback);
        };

        /**
         * Deletes a branch.
         *
         * @param repository
         * @param obj
         * @returns {*}
         */
        deleteBranch(repository, branch)
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);

            return this.del("/repositories/" + repositoryId + "/branches/" + branchId, {}, callback);
        }

        /**
         * Updates a branch.
         *
         * @param repository
         * @param obj
         */
        updateBranch(repository, branch, obj)
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);

            return this.put("/repositories/" + repositoryId + "/branches/" + branchId, {}, obj, callback);
        }
    }

    return BranchSession;
};
