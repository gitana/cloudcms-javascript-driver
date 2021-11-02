import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('graphql_2', function() {
    it('should run graphql test without error using object bound functions', async function() {
        var session = await CloudCMS.connect();
        var repository = await session.createRepository();
        var branch = await repository.readBranch("master");

        var bookType = await branch.createNode({
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

        var schema = await branch.graphqlSchema();
        assert.isNotNull(schema);

        var node = await branch.createNode({
            "title": "hello",
            "description": "this is a book about salutations",
            "author": "mr bean",
            "_type": "custom:book"
        });
        
        var node2 = await branch.createNode({
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

        var result = await branch.graphqlQuery(query);
        assert.isTrue("data" in result);
        if (result.data)
        {
            assert.isTrue("custom_books" in result.data)
            assert.equal(2, result.data["custom_books"].length)
            assert.equal(2, Object.keys(result.data["custom_books"][0]).length);
        }
        
    });
});