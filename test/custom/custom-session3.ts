import * as CloudCMS from "../..";
//import * as CustomSession from './custom-session';
import CustomSession from './custom-session.js';
var assert = require('chai').assert;

describe('custom_session_3', function() {
    it('should run sample method using callback without error', function(done) {

        // use a custom session
        // this has the test() method
        CloudCMS.session(CustomSession);

        // connect
        CloudCMS.connect<CustomSession>(function(err, session) {

            session.test(function(err, count) {

                assert.equal(count, 101);
                done();

            });
        });
    });
});