import * as cloudcms from "../..";
var assert = require('chai').assert;

describe('domain_1', function() {
    it('should read domain and users without error', async function() {

        const session = await cloudcms.connect();
        const domains = await session.queryDomains({});
        assert.isAtLeast(domains.total_rows, 1);

        const domain = await session.readDomain(domains.rows[0]._doc);
        assert.isObject(domain);

        const principals = await session.queryPrincipals(domain, {});
        assert.isAtLeast(principals.total_rows, 1);

        const principal = await session.readPrincipal(domain, principals.rows[0]._doc);
        assert.isObject(principal);
    });
});