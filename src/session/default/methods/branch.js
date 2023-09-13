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
        listBranches(repository, pagination)
        {
            var repositoryId = this.acquireId(repository);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {
                full: true
            };

            if (pagination) {
                qs = {
                    ...qs,
                    ...pagination
                }
            }

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

        /**
         * Resets a branch to a specified changeset, by creating a new changeset and appending it to the tip.
         * @param {*} repository 
         * @param {*} branch 
         * @param {*} changeset 
         * @returns 
         */
        resetBranch(repository, branch, changeset)
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var changesetId = this.acquireId(changeset);
            var callback = this.extractOptionalCallback(arguments);

            var params = {
                "id":  changesetId
            };

            return this.post("/repositories/" + repositoryId + "/branches/reset/start" + branchId, params, null, callback);
        }

        startChangesetHistory(repository, branch, config)
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);

            return this.post(`/repositories/${repositoryId}/branches/${branchId}/history/start`, config, {}, callback);
        }

        // Branch Changes

        startBranchChanges(repository, sourceBranch, targetBranch, pagination, opts)
        {
            var repositoryId = this.acquireId(repository);
            var sourceBranchId = this.acquireId(sourceBranch);
            var targetBranchId = this.acquireId(targetBranch);
            var callback = this.extractOptionalCallback(arguments);

            if (!pagination) {
                pagination = {};
            }

            if (!pagination.limit) {
                pagination.limit = 9999999;
            }

            var params = Object.assign({}, pagination, opts);
            params.id = sourceBranchId;

            return this.post(`/repositories/${repositoryId}/branches/${targetBranchId}/changes/start`, params, null, callback);
        }

        invalidateBranchChanges(repository, branch)
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);

            return this.post(`/repositories/${repositoryId}/branches/${branchId}/changes/invalidate`, null, null, callback);
        }

        exportBranchChanges(repository, sourceBranch, targetBranch, view)
        {
            var repositoryId = this.acquireId(repository);
            var sourceBranchId = this.acquireId(sourceBranch);
            var targetBranchId = this.acquireId(targetBranch);
            var callback = this.extractOptionalCallback(arguments);

            var params = {
                "id": sourceBranchId
            };
            if (view) {
                params["view"] = view;
            }

            return this.download(`/repositories/${repositoryId}/branches/${targetBranchId}/changes/export`, params, callback);
        }
    }

    return BranchSession;
};
