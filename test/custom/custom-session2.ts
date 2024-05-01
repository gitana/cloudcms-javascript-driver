import * as CloudCMS from "../..";
//import * as CustomSession from './custom-session';
import CustomSession from './custom-session.js';

var assert = require('chai').assert;

describe('custom_session_2', function() {
    it('should run sample method using promise without error', function(done) {

        // use a custom session
        // this has the test() method
        CloudCMS.session(CustomSession);

        // connect
        CloudCMS.connect<CustomSession>().then(function(session) {

            session.test().then(function(count) {

                assert.equal(count, 101);
                done();

            });
        });
    });
});