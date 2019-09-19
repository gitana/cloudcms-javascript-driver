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

            return this.post("/repositories/" + repositoryId + "/branches/query", pagination, query, callback);
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
