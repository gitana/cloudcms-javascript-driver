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

        exportProject(sourceRefs, opts, configuration)
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

            var payload = {
                ...configuration,
                "sources": sourceRefs
            };

            return this.post("/transfer/export", params, payload, callback);
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
    }

    return TransferSession;
};
