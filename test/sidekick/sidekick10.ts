import * as CloudCMS from "../..";

var assert = require('chai').assert;

describe('sidekick_1', function() {
    it('should test sidekick methods in a repository without error', async function() {

        var session = await CloudCMS.connect();

        // create an agent
        var agent1 = await session.createAgent({
            "fa": 1
        });

        // query for agents
        var r1 = await session.queryAgents({
            "fa": 1
        });
        assert.equal(1, r1.rows.length);

        // read back agent
        var agent2 = await session.readAgent(agent1._doc);
        assert.isNotNull(agent2);

        // update the agent
        agent2["fo"] = "foo";
        await session.updateAgent(agent2);

        // verify the update worked
        var agent3 = await session.readAgent(agent2._doc);
        assert.isNotNull(agent3);
        assert.equal("foo", agent2["fo"]);

        // delete the agent
        await session.deleteAgent(agent3);

        // verify the delete worked
        var agent4 = await session.readAgent(agent3._doc);
        assert.isNull(agent4);
    });
});