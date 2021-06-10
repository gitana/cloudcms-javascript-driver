import * as CloudCMS from "../..";
import { CustomStorage } from './custom-storage';
var assert = require('chai').assert;

describe('custom_storage_2', function() {
    it('should run using custom storage / promise without error', function(done) {

        // custom storage
        CloudCMS.storage(CustomStorage);

        // connect
        CloudCMS.connect().then(function(session) {

            assert.isOk(true);
            done();

        });
    });
});