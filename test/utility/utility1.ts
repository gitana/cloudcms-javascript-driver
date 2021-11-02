import * as cloudcms from "../..";
import * as UtilitySession from '../../src/session/utility/session';
var assert = require('chai').assert;

describe('utility_1', function() {
    it('should run app utility functions accurately without error', async function() {
        // Use utility session
        cloudcms.session(UtilitySession);
        const session = await cloudcms.connect<UtilitySession>();
        console.log(UtilitySession);

        const application = await session.application();
        assert.isObject(application);
        assert.equal(session.config.application, application._doc);

        const project = await session.project();
        assert.isObject(project);

        const stack = await session.stack();
        assert.isObject(stack);
        assert.equal(project.stackId, stack._doc);

        const datastores = await session.dataStores();
        assert.isArray(datastores);

        const datastoresByKey = await session.dataStoresByKey();

        const repository = await session.repository();
        assert.equal(repository._doc, datastoresByKey.content._doc);

        const branchesById = await session.branchesById();
        assert.isObject(branchesById);

        const master = await session.master();
        assert.equal("MASTER", master.type);
    });
});