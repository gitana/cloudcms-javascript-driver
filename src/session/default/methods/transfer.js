module.exports = function(Session)
{
    var Helper = require("../../../helper");

    class TransferSession extends Session
    {
        exportArchive(sourceRefs, opts, configuration)
        {
            var callback = this.extractOptionalCallback(arguments);

            var optsErr = null;
            if (!Helper.isObject(opts))
            {
                optsErr = "opts is not an object";
            }
            else if (!("group" in opts))
            {
                optsErr = "opts is missing 'group'";
            }
            else if (!("artifact" in opts))
            {
                optsErr = "opts is missing 'artifact'";
            }
            else if (!("version" in opts))
            {
                optsErr = "opts is missing 'version'";
            }
            if (optsErr)
            {
                throw new Error(optsErr);
            }

            var vaultId = "primary";
            if (opts.vault)
            {
                vaultId = this.acquireId(vault);
            }

            var params = {
                ...opts,
                "vault": vaultId,
                "schedule": "ASYNCHRONOUS"
            };

            if (!Helper.isArray(sourceRefs))
            {
                sourceRefs = [sourceRefs];
            }

            if (!Helper.isObject(configuration))
            {
                configuration = {};
            }

            if (!("tipChangesetOnly" in configuration))
            {
                configuration.tipChangesetOnly = true;
            }

            var payload = {
                ...configuration,
                "sources": sourceRefs
            };

            return this.post("/transfer/export", params, payload, callback);
        }

        async exportNodes(repository, branch, nodes, opts, configuration)
        {
            var self = this;
            var callback = this.extractOptionalCallback(arguments);

            if (!Helper.isArray(nodes))
            {
                nodes = [nodes];
            }

            var nodeRefs = await Promise.all(nodes.map(node => self.buildNodeBranchReference(repository, branch, node)));
            return self.exportArchive(nodeRefs, opts, configuration, callback);
        }

        async exportProject(project, opts, configuration, callback)
        {
            var callback = this.extractOptionalCallback(arguments);
            var projectRef = await this.buildProjectReference(project);

            return self.exportArchive([projectRef], opts, configuration, callback);
        }

        importArchive(targetRef, opts, configuration)
        {
            var callback = this.extractOptionalCallback(arguments);

            var optsErr = null;
            if (!Helper.isObject(opts))
            {
                optsErr = "opts is not an object";
            }
            else if (!("group" in opts))
            {
                optsErr = "opts is missing 'group'";
            }
            else if (!("artifact" in opts))
            {
                optsErr = "opts is missing 'artifact'";
            }
            else if (!("version" in opts))
            {
                optsErr = "opts is missing 'version'";
            }
            if (optsErr)
            {
                throw new Error(optsErr);
            }

            var vaultId = "primary";
            if (opts.vault)
            {
                vaultId = this.acquireId(vault);
            }

            var params = {
                ...opts,
                "vault": vaultId,
                "target": targetRef,
                "schedule": "ASYNCHRONOUS"
            };

            var payload = {
                ...configuration
            };

            return this.post("/transfer/import", params, payload, callback);
        }

        async importArchiveToPlatform(opts, configuration)
        {
            var callback = this.extractOptionalCallback(arguments);
            var platformRef = await this.buildBranchReference(repository, branch);
            return this.importArchive(platformRef, opts, configuration, callback);
        }

        async importArchiveToBranch(repository, branch, opts, configuration)
        {
            var callback = this.extractOptionalCallback(arguments);
            var branchRef = await this.buildBranchReference(repository, branch);
            return this.importArchive(branchRef, opts, configuration, callback);
        }
    }

    return TransferSession;
};
