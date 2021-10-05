module.exports = function(Session)
{
    class TransferSession extends Session
    {
        exportArchive(sourceRefs, group, artifact, version, configuration, vault, callback)
        {
            var vaultId = "primary";
            if (vault)
            {
                vaultId = this.acquireId(vault);
            }
            var callback = this.extractOptionalCallback(arguments);

            var params = {
                "vault": this._doc,
                "group": group,
                "artifact": artifact,
                "version": version,
                "schedule": "ASYNCHRONOUS"
            };

            var payload = {
                ...configuration,
                "sources": sourceRefs
            };

            return this.post("/transfer/export", params, payload, callback);
        }

        importArchive(targetRef, group, artifact, version, configuration, vault)
        {
            var vaultId = "primary";
            if (vault)
            {
                vaultId = this.acquireId(vault);
            }
            var callback = this.extractOptionalCallback(arguments);

            var params = {
                "vault": this._doc,
                "target": targetRef,
                "group": group,
                "artifact": artifact,
                "version": version,
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
