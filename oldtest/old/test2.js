var CloudCMS = require("../src/index");

describe('Node', function() {
    describe('#addFeature()', function() {
        it('should add a feature without error', async function() {

            var session = await CloudCMS.connect();
            session.defaults.qs.full = true;

            var platformService = session.platformService();

            // create a repository
            var repository = await platformService.createRepository({
                "title": "My First Repository"
            });

            var branchService = session.branchService(repository, "master");

            var node = await branchService.createNode({
                "title": "First Node"
            });

            var nodeService = branchService.nodeService(node);

            // add feature
            await nodeService.addFeature("f:filename", { "filename": "Resources" });
        });
    });
});