module.exports = function(Session)
{
    class GraphQLSession extends Session
    {
        graphqlQuery(repository, branch, query, operationName, variables)
        {
            var repositoryId = this.acquireId(repository);
            var branchId = this.acquireId(branch);
            var callback = this.extractOptionalCallback(arguments);

            var params = {
                query: query
            };

            if (variables)
            {
                params.variables = variables;
            }

            if (operationName)
            {
                params.operationName = operationName;
            }

            return this.get("/repositories/" + repositoryId + "/branches/" + branchId + "/graphql", params, callback);
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
