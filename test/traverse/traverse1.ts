import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('traverse_1', function() {
    it('should run node test without error', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();
        var branchId = "master";

        // build content model and data
        var type1 = await session.createNode(repository, branchId, {
            _qname: "test:type1",
            _type: "d:type",
            title: "type1",
            _parent: "n:node",
            type: "object",
            properties: {
            }
        });
        type1 = await session.readNode(repository, branchId, type1._doc);

        var type2 = await session.createNode(repository, branchId, {
            _qname: "test:type2",
            _type: "d:type",
            title: "type2",
            _parent: "n:node",
            type: "object",
            properties: {
            }
        });
        type2 = await session.readNode(repository, branchId, type2._doc);

        var assocType1 = await session.createNode(repository, branchId, {
            _qname: "test:assoc-type1",
            _type: "d:association",
            title: "assoc-type1",
            _parent: "a:linked"
        });
        assocType1 = await session.readNode(repository, branchId, assocType1._doc);

        var assocType2 = await session.createNode(repository, branchId, {
            _qname: "test:assoc-type2",
            _type: "d:association",
            title: "assoc-type2",
            _parent: "a:linked"
        });
        assocType2 = await session.readNode(repository, branchId, assocType2._doc);

        var node1 = await session.createNode(repository, branchId, {
            title: "node1",
            _type: "n:node"
        });
        node1 = await session.readNode(repository, branchId, node1._doc);
        // console.log(JSON.stringify(node1, null, 2));

        var node2 = await session.createNode(repository, branchId, {
            title: "node2",
            _type: assocType1._qname
        });
        var node3 = await session.createNode(repository, branchId, {
            title: "node3",
            _type: assocType2._qname
        });
        var node4 = await session.createNode(repository, branchId, {
            title: "node4",
            _type: assocType2._qname
        });
        var node5 = await session.createNode(repository, branchId, {
            title: "node5",
            _type: "n:node"
        });
        var node6 = await session.createNode(repository, branchId, {
            title: "node6",
            _type: "n:node"
        });

        await session.associate(repository, branchId, node1, node2, assocType1._qname, "DIRECTED");
        await session.associate(repository, branchId, node2, node3, assocType2._qname, "DIRECTED");
        await session.associate(repository, branchId, node2, node3, "a:linked", "DIRECTED");
        await session.associate(repository, branchId, node2, node4, assocType2._qname, "DIRECTED");
        await session.associate(repository, branchId, node2, node6, "a:linked", "DIRECTED");
        await session.associate(repository, branchId, node4, node5, assocType2._qname, "DIRECTED");

        // traverse
        var config = {
            associations: {
                'test:assoc-type1': 'ANY',
                'test:assoc-type2': 'ANY'
            },
            depth: 3
        };

        var traversalResult1 = await session.traverseNode(repository, branchId, node1, config);
        // console.log(JSON.stringify(traversalResult1.nodes, null, 2));

        assert.exists(traversalResult1.nodes[node1._doc]);
        assert.exists(traversalResult1.nodes[node2._doc]);
        assert.exists(traversalResult1.nodes[node3._doc]);
        assert.exists(traversalResult1.nodes[node4._doc]);
        assert.exists(traversalResult1.nodes[node5._doc]);
        assert.notExists(traversalResult1.nodes[node6._doc]);
    });
});