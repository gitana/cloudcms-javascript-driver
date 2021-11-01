const gitanaJson = require("./gitana.json");
const cloudcms = require(".");

(async function test() {

    const session = await cloudcms.connect(gitanaJson);

    const branch = await session.readBranch("026e69ddefe3a5a6a6cc", "master");
})();