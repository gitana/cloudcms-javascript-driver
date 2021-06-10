import * as CloudCMS from "../..";
import { CustomStorage } from './custom-storage';
var assert = require('chai').assert;

describe('custom_storage_1', function() {
    it('should run using custom storage / await without error', async function() {

        // custom storage
        CloudCMS.storage(CustomStorage);

        // connect
        var session = await CloudCMS.connect();

        // TODO: something

        assert.isOk(true);
    });
});