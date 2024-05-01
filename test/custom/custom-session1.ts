import * as CloudCMS from "../..";
//import * as CustomSession from './custom-session';
import CustomSession from './custom-session.js';
//var CustomSession = require("./custom-session.js");
var assert = require('chai').assert;

describe('custom_session_1', function() {
    it('should run sample method using await without error', async function() {


        // use a custom session
        // this has the test() method
        // var customSession: Session = require("./custom-session");
        CloudCMS.session(CustomSession);

        // connect
        var session = await CloudCMS.connect<CustomSession>();

        // fire test
        var count = await session.test();
        assert.equal(count, 101);
    });
});