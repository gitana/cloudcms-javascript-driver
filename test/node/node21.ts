import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('node21', function() {
    it('should run node test without error using object bound functions', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();
        var branch = await repository.readBranch("master");

        // build out hierarchy
        await branch.createNode({ "title": "folder1"}, { "parentPath": "/"});
        await branch.createNode({ "title": "folder11"}, { "parentPath": "/folder1"});
        await branch.createNode({ "title": "folder12"}, { "parentPath": "/folder1"});
        await branch.createNode({ "title": "folder2"}, { "parentPath": "/"});
        await branch.createNode({ "title": "folder11"}, { "parentPath": "/folder2"});
        await branch.createNode({ "title": "folder12"}, { "parentPath": "/folder2"});
        await branch.createNode({ "title": "folder111"}, { "parentPath": "/folder1/folder11"});
        await branch.createNode({ "title": "folder112"}, { "parentPath": "/folder1/folder11"});
        await branch.createNode({ "title": "folder111"}, { "parentPath": "/folder1/folder12"});
        await branch.createNode({ "title": "folder112"}, { "parentPath": "/folder1/folder12"});
        await branch.createNode({ "title": "folder111"}, { "parentPath": "/folder2/folder11"});
        await branch.createNode({ "title": "folder112"}, { "parentPath": "/folder2/folder11"});
        await branch.createNode({ "title": "folder111"}, { "parentPath": "/folder2/folder12"});
        await branch.createNode({ "title": "folder112"}, { "parentPath": "/folder2/folder12"});

        // create some nodes at various paths
        var node1 = await branch.createNode({ "title": "node1"}, { "parentPath": "/folder1/folder11/folder111"});
        var node2 = await branch.createNode({ "title": "node2"}, { "parentPath": "/folder1/folder11/folder112"});
        var node3 = await branch.createNode({ "title": "node3"}, { "parentPath": "/folder1/folder12/folder111"});
        var node4 = await branch.createNode({ "title": "node4"}, { "parentPath": "/folder1/folder12/folder112"});
        var node5 = await branch.createNode({ "title": "node5"}, { "parentPath": "/folder2/folder11/folder111"});
        var node6 = await branch.createNode({ "title": "node6"}, { "parentPath": "/folder2/folder11/folder112"});
        var node7 = await branch.createNode({ "title": "node7"}, { "parentPath": "/folder2/folder12/folder111"});
        var node8 = await branch.createNode({ "title": "node8"}, { "parentPath": "/folder2/folder12/folder112"});

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
        var n1 = await branch.readNode("root", "/folder1/folder11/folder111/node1");
        var n2 = await branch.readNode("root", "/folder1/folder11/folder112/node2");
        var n3 = await branch.readNode("root", "/folder1/folder12/folder111/node3");
        var n4 = await branch.readNode("root", "/folder1/folder12/folder112/node4");
        var n5 = await branch.readNode("root", "/folder2/folder11/folder111/node5");
        var n6 = await branch.readNode("root", "/folder2/folder11/folder112/node6");
        var n7 = await branch.readNode("root", "/folder2/folder12/folder111/node7");
        var n8 = await branch.readNode("root", "/folder2/folder12/folder112/node8");

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