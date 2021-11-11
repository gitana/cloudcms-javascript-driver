module.exports = function(Session)
{
    class ReleaseSession extends Session
    {
        startCreateRelease(repository, object, sourceRelease)
        {
            var repositoryId = this.acquireId(repository);
            const sourceReleaseId = sourceRelease ? this.acquireId(sourceRelease) : null;
            var callback = this.extractOptionalCallback(arguments);

            let params = {};
            if (sourceReleaseId)
            {
                params.sourceId = sourceReleaseId;
            }

            return this.post(`/repositories/${repositoryId}/releases/create/start`, params, object, callback);
        }

        readRelease(repository, releaseId)
        {
            var repositoryId = this.acquireId(repository);
            var callback = this.extractOptionalCallback(arguments);

            return this.get(`/repositories/${repositoryId}/releases/${releaseId}`, {}, null, callback);
        }

        updateRelease(repository, release, obj)
        {
            var repositoryId = this.acquireId(repository);
            var releaseId = this.acquireId(release);
            var callback = this.extractOptionalCallback(arguments);

            return this.put("/repositories/" + repositoryId + "/releases/" + releaseId, {}, obj, callback);
        }

        deleteRelease(repository, release)
        {
            var repositoryId = this.acquireId(repository);
            var releaseId = this.acquireId(release);
            var callback = this.extractOptionalCallback(arguments);

            return this.del("/repositories/" + repositoryId + "/releases/" + releaseId, {}, callback);
        }

        queryReleases(repository, query, pagination)
        {
            var repositoryId = this.acquireId(repository);
            var callback = this.extractOptionalCallback(arguments);

            return this.post("/repositories/" + repositoryId + "/releases/query", pagination, query, callback);
        }
        
        listReleases(repository, pagination)
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

            return this.get("/repositories/" + repositoryId + "/releases", qs, callback);
        }
    }

    return ReleaseSession;
}