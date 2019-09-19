var CloudCMS = require("../../src/index");
var assert = require('chai').assert;

describe('graphql_1', function() {
    it('should run graphql test without error', async function() {
        var session = await CloudCMS.connect();
        var repository = await session.createRepository();
        var branch = "master";
        var bookType = await session.createNode(repository, branch, {
            "_qname":"custom:book",
            "_type":"d:type",
        
            "type":"object",
            "description":"Node List Test Book Type",
            "properties":{
                "title": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "author": {
                    "type": "string"
                }
            }
        });

        var schema = await session.graphqlSchema(repository, branch);
        assert.isNotNull(schema);

        var node = await session.createNode(repository, branch, {
            "title": "hello",
            "description": "this is a book about salutations",
            "author": "mr bean",
            "_type": "custom:book"
        });
        
        var node2 = await session.createNode(repository, branch, {
            "title": "goodbye",
            "description": "leave",
            "author": "guillermo del toro",
            "_type": "custom:book"
        });
        
        var query = `
            query {
            custom_books {
                    title
                    author
                }
            }
        `;

        var result = await session.graphqlQuery(repository, branch, query);
        assert.isTrue("data" in result);
        assert.isTrue("custom_books" in result.data)
        assert.equal(2, result.data["custom_books"].length)
        assert.equal(2, Object.keys(result.data["custom_books"][0]).length);
    });
});