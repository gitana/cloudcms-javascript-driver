module.exports = function(Session)
{
    var Branch = require("../objects/Branch"); 

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
        async queryBranches(repository, query, pagination)
        {
            var repositoryId = this.acquireId(repository);
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.post("/repositories/" + repositoryId + "/branches/query", pagination, query, callback);
            result.rows = result.rows.map(row => new Branch(this, repositoryId, row));
            return result;
        };

        /**
         * Read a branch.
         *
         * @param repository
         * @param branch
         *
         * @returns {*}
         */
        async readBranch(repository, branch)
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.get("/repositories/" + repositoryId + "/branches/" + branchId, {}, callback);
            return new Branch(this, repositoryId, result);
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
        async createBranch(repository, branch, changesetId, obj={})
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {
                changeset: changesetId,
                branch: branchId
            };

            let result = await this.post("/repositories/" + repositoryId + "/branches", qs, obj, callback);
            return new Branch(this, repositoryId, result);
        };

        /**
         * List branches.
         *
         * @param repository
         *
         * @returns {*}
         */
        async listBranches(repository)
        {
            var repositoryId = this.acquireId(repository);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {
                full: true
            };

            let result = await this.get("/repositories/" + repositoryId + "/branches", qs, callback);
            result.rows = result.rows.map(row => new Branch(this, repositoryId, row));
            return result;
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
        async updateBranch(repository, branch, obj)
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);

            let result = await this.put("/repositories/" + repositoryId + "/branches/" + branchId, {}, obj, callback);
            return new Branch(this, repositoryId, result);
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

            return this.get("/repositories/" + repositoryId + "/branches/" + branchId, params, null, callback);
        }

        
    }

    return BranchSession;
};
