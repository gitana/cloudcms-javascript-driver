var Branch = require("./branch");

class Repository
{
    constructor(repositoryId)
    {
        this.repositoryId = repositoryId;
    }

    branch(branchId)
    {
        return new Branch(this.repositoryId, branchId);
    }

    queryBranches(session, query, pagination)
    {
        return session.post("/repositories/" + this.repositoryId + "/branches/query", pagination, query);
    };

};

module.exports = Repository;