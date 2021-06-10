import * as CloudCMS from "../..";
import { CustomStorage } from './custom-storage';
var assert = require('chai').assert;

describe('custom_storage_3', function() {
    it('should run using custom storage / callback without error', function(done) {

        // custom storage
        CloudCMS.storage(CustomStorage);

        // connect
        CloudCMS.connect(function(err, session) {

            assert.isOk(true);
            done();

        });
    });
});