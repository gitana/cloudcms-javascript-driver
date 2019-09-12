var DefaultSession = require("../../src/session/default/session");

var Helper = require("../../src/helper");

class CustomSession extends DefaultSession
{
    test()
    {
        // use the Helper.sessionFunction method to support Promise, callback or async/await
        // put your work into the finish method
        return Helper.sessionFunction.call(this, arguments, function(finish) {
            return setTimeout(function() {
                finish(null, 101);
            }, 250);
        });
    }
}

module.exports = CustomSession;
