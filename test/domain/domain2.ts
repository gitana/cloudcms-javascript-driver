import * as cloudcms from "../..";
var assert = require('chai').assert;

describe('domain_2', function() {
    it('should read domain and users without error with object bound functions', async function() {

        const session = await cloudcms.connect();
        const domains = await session.queryDomains({});
        assert.isAtLeast(domains.rows.length, 1);

        const domain = await session.readDomain(domains.rows[0]._doc);
        assert.isObject(domain);

        const principals = await domain.queryPrincipals({});
        assert.isAtLeast(principals.rows.length, 1);

        const principal = await domain.readPrincipal(principals.rows[0]._doc);
        assert.isObject(principal);
    });
});