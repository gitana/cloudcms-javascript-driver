module.exports = function(Session)
{
    class GraphQLSession extends Session
    {
        graphqlQuery(repository, branch, query, operationName, variables)
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);

            var body = {
                query: query
            };

            if (variables)
            {
                body.variables = variables;
            }

            if (operationName)
            {
                body.operationName = operationName;
            }

            return this.post("/repositories/" + repositoryId + "/branches/" + branchId + "/graphql", null, body, callback);
        }

        graphqlSchema(repository, branch)
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);
            
            return this.get("/repositories/" + repositoryId + "/branches/" + branchId + "/graphql/schema", {}, callback);            
        }
    }

    return GraphQLSession;
}
