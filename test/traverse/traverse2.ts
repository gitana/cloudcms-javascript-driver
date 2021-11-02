import * as CloudCMS from "../..";
var assert = require('chai').assert;

describe('traverse_2', function() {
    it('should run node test without error using object bound functions', async function() {

        var session = await CloudCMS.connect();

        var repository = await session.createRepository();
        var branch = await repository.readBranch("master");

        // build content model and data
        var type1 = await branch.createNode({
            _qname: "test:type1",
            _type: "d:type",
            title: "type1",
            _parent: "n:node",
            type: "object",
            properties: {
            }
        });
        type1 = await branch.readNode(type1._doc);

        var type2 = await branch.createNode({
            _qname: "test:type2",
            _type: "d:type",
            title: "type2",
            _parent: "n:node",
            type: "object",
            properties: {
            }
        });
        type2 = await branch.readNode(type2._doc);

        var assocType1 = await branch.createNode({
            _qname: "test:assoc-type1",
            _type: "d:association",
            title: "assoc-type1",
            _parent: "a:linked"
        });
        assocType1 = await branch.readNode(assocType1._doc);

        var assocType2 = await branch.createNode({
            _qname: "test:assoc-type2",
            _type: "d:association",
            title: "assoc-type2",
            _parent: "a:linked"
        });
        assocType2 = await branch.readNode(assocType2._doc);

        var node1 = await branch.createNode({
            title: "node1",
            _type: "n:node"
        });
        node1 = await branch.readNode(node1._doc);
        // console.log(JSON.stringify(node1, null, 2));

        var node2 = await branch.createNode({
            title: "node2",
            _type: assocType1._qname
        });
        var node3 = await branch.createNode({
            title: "node3",
            _type: assocType2._qname
        });
        var node4 = await branch.createNode({
            title: "node4",
            _type: assocType2._qname
        });
        var node5 = await branch.createNode({
            title: "node5",
            _type: "n:node"
        });
        var node6 = await branch.createNode({
            title: "node6",
            _type: "n:node"
        });

        await node1.associate(node2, assocType1._qname, "DIRECTED");
        await node2.associate(node3, assocType2._qname, "DIRECTED");
        await node2.associate(node3, "a:linked", "DIRECTED");
        await node2.associate(node4, assocType2._qname, "DIRECTED");
        await node2.associate(node6, "a:linked", "DIRECTED");
        await node4.associate(node5, assocType2._qname, "DIRECTED");

        // traverse
        var config = {
            associations: {
                'test:assoc-type1': 'ANY',
                'test:assoc-type2': 'ANY'
            },
            depth: 3
        };

        var traversalResult1 = await node1.traverseNode(config);
        // console.log(JSON.stringify(traversalResult1.nodes, null, 2));

        assert.exists(traversalResult1.nodes[node1._doc]);
        assert.exists(traversalResult1.nodes[node2._doc]);
        assert.exists(traversalResult1.nodes[node3._doc]);
        assert.exists(traversalResult1.nodes[node4._doc]);
        assert.exists(traversalResult1.nodes[node5._doc]);
        assert.notExists(traversalResult1.nodes[node6._doc]);
    });
});