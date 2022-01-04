import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('node11', function() {
    it('should run node test without error', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();
        var branchId = "master";

        // build out hierarchy
        await session.createNode(repository, branchId, { "title": "folder1"}, { "parentPath": "/"});
        await session.createNode(repository, branchId, { "title": "folder11"}, { "parentPath": "/folder1"});
        await session.createNode(repository, branchId, { "title": "folder12"}, { "parentPath": "/folder1"});
        await session.createNode(repository, branchId, { "title": "folder2"}, { "parentPath": "/"});
        await session.createNode(repository, branchId, { "title": "folder11"}, { "parentPath": "/folder2"});
        await session.createNode(repository, branchId, { "title": "folder12"}, { "parentPath": "/folder2"});
        await session.createNode(repository, branchId, { "title": "folder111"}, { "parentPath": "/folder1/folder11"});
        await session.createNode(repository, branchId, { "title": "folder112"}, { "parentPath": "/folder1/folder11"});
        await session.createNode(repository, branchId, { "title": "folder111"}, { "parentPath": "/folder1/folder12"});
        await session.createNode(repository, branchId, { "title": "folder112"}, { "parentPath": "/folder1/folder12"});
        await session.createNode(repository, branchId, { "title": "folder111"}, { "parentPath": "/folder2/folder11"});
        await session.createNode(repository, branchId, { "title": "folder112"}, { "parentPath": "/folder2/folder11"});
        await session.createNode(repository, branchId, { "title": "folder111"}, { "parentPath": "/folder2/folder12"});
        await session.createNode(repository, branchId, { "title": "folder112"}, { "parentPath": "/folder2/folder12"});

        // create some nodes at various paths
        var node1 = await session.createNode(repository, branchId, { "title": "node1"}, { "parentPath": "/folder1/folder11/folder111"});
        var node2 = await session.createNode(repository, branchId, { "title": "node2"}, { "parentPath": "/folder1/folder11/folder112"});
        var node3 = await session.createNode(repository, branchId, { "title": "node3"}, { "parentPath": "/folder1/folder12/folder111"});
        var node4 = await session.createNode(repository, branchId, { "title": "node4"}, { "parentPath": "/folder1/folder12/folder112"});
        var node5 = await session.createNode(repository, branchId, { "title": "node5"}, { "parentPath": "/folder2/folder11/folder111"});
        var node6 = await session.createNode(repository, branchId, { "title": "node6"}, { "parentPath": "/folder2/folder11/folder112"});
        var node7 = await session.createNode(repository, branchId, { "title": "node7"}, { "parentPath": "/folder2/folder12/folder111"});
        var node8 = await session.createNode(repository, branchId, { "title": "node8"}, { "parentPath": "/folder2/folder12/folder112"});

        // verify nodes exist
        assert.exists(node1);
        assert.exists(node2);
        assert.exists(node3);
        assert.exists(node4);
        assert.exists(node5);
        assert.exists(node6);
        assert.exists(node7);
        assert.exists(node8);

        // read back by path
        var n1 = await session.readNode(repository, branchId, "root", "/folder1/folder11/folder111/node1");
        var n2 = await session.readNode(repository, branchId, "root", "/folder1/folder11/folder112/node2");
        var n3 = await session.readNode(repository, branchId, "root", "/folder1/folder12/folder111/node3");
        var n4 = await session.readNode(repository, branchId, "root", "/folder1/folder12/folder112/node4");
        var n5 = await session.readNode(repository, branchId, "root", "/folder2/folder11/folder111/node5");
        var n6 = await session.readNode(repository, branchId, "root", "/folder2/folder11/folder112/node6");
        var n7 = await session.readNode(repository, branchId, "root", "/folder2/folder12/folder111/node7");
        var n8 = await session.readNode(repository, branchId, "root", "/folder2/folder12/folder112/node8");

        // test node path
        var n8Paths = await session.resolveNodePaths(repository, branchId, n8);
        assert.isAbove(Object.keys(n8Paths).length, 0);

        var n8Path = await session.resolveNodePath(repository, branchId, n8);
        assert.equal("/folder2/folder12/folder112/node8", n8Path);

        // verify nodes exist
        assert.exists(n1);
        assert.exists(n2);
        assert.exists(n3);
        assert.exists(n4);
        assert.exists(n5);
        assert.exists(n6);
        assert.exists(n7);
        assert.exists(n8);
    });
});