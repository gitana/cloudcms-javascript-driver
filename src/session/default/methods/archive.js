module.exports = function(Session)
{
    var FormData = require("form-data");

    class ArchiveSession extends Session
    {
        readArchive(vault, archive)
        {
            var vaultId = this.acquireId(vault);
            var archiveId = this.acquireId(archive);
            var callback = this.extractOptionalCallback(arguments);

            return this.get(`/vaults/${vaultId}/archives/${archiveId}`, {}, callback);
        }

        updateArchive(vault, archive)
        {
            var vaultId = this.acquireId(vault);
            var archiveId = archive._doc;
            var callback = this.extractOptionalCallback(arguments);

            return this.put(`/vaults/${vaultId}/archives/${archiveId}`, {}, archive, callback);
        }

        deleteArchive(vault, archive)
        {
            var vaultId = this.acquireId(vault);
            var archiveId = this.acquireId(archive);
            var callback = this.extractOptionalCallback(arguments);

            return this.del(`/vaults/${vaultId}/archives/${archiveId}`, {}, callback);
        }

        lookupArchive(vault, group, artifact, version)
        {
            var vaultId = this.acquireId(vault);
            var callback = this.extractOptionalCallback(arguments);

            var qs = {
                "group": group,
                "artifact": artifact,
                "version": version
            }

            return this.get(`/vaults/${vaultId}/archives/lookup`, qs, callback)
        }

        queryArchives(vault, query, pagination)
        {
            var vaultId = this.acquireId(vault);
            var callback = this.extractOptionalCallback(arguments);

            return this.post(`/vaults/${vaultId}/archives/query`, pagination, query, callback);
        }

        async uploadArchive(vault, opts, file, filename)
        {
            var vaultId = this.acquireId(vault);
            var callback = this.extractOptionalCallback(arguments);

            var uri = `/vaults/${vaultId}/archives`;
            var contentType = "application/zip;charset=utf-8";

            var formData = new FormData();
            formData.append("archive", file, {contentType: contentType, filename: filename});

            var response = await this.multipartPost(uri, opts, formData, callback);
            if (response.rows && response.rows.length > 0)
            {
                response = response.rows[0];
            }

            return response;
        }

        downloadArchiveById(vault, archive)
        {
            var vaultId = this.acquireId(vault);
            var archiveId = this.acquireId(archive);
            var callback = this.extractOptionalCallback(arguments);

            return this.download(`/vaults/${vaultId}/archives/${archiveId}/download`, {}, callback);
        }

        downloadArchive(vault, group, artifact, version)
        {
            var vaultId = this.acquireId(vault);
            var callback = this.extractOptionalCallback(arguments);
            var qs = {
                groupId: group,
                artifactId: artifact,
                versionId: version
            }

            return this.download(`/vaults/${vaultId}/archives/download`, qs, callback);
        }
    }

    return ArchiveSession;
};