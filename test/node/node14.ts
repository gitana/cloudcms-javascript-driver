import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('node14', function() {
    it('should run generic node test without error', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();
        var branchId = "master";

        // Create a custom type
        await session.createNode(repository, branchId, {
            "_qname":"custom:article",
            "_type":"d:type",
            "_parent":"n:node",
        
            "description":"Article",
            "type":"object",
            "properties":{
                "title":{
                    "type":"string"
                }
            }
        });

        interface CustomArticle {
            title?: string
        }

        // Create an article with generic type
        const articleId: string = (await session.createNode(repository, branchId, { "_type": "custom:article", "title": "an article" }))._doc;
        const article: CloudCMS.Node & CustomArticle = await session.readNode(repository, branchId, articleId);
        assert.equal(article.title, "an article");
        assert.exists(article._doc);
        assert.equal(article._type, "custom:article");
    });
});

var sleep = function(ms)
{
    return new Promise<void>(function(resolve, reject) {

        setTimeout(function() {
            resolve();
        }, ms);
    });
};