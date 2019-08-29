var Repository = require("./repository");

class Platform
{
    constructor()
    {
    }

    repository(repositoryId)
    {
        return new Repository(repositoryId);
    }

    queryRepositories(session, query, pagination)
    {
        return session.post("/repositories/query", pagination, query);
    };

};

module.exports = Platform;