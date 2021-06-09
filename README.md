# cloudcms-javascript-driver

Updated Cloud CMS JS Driver using modern ECMAScript and Promises

## Installation

```
npm install --save cloudcms
```

## Usage

This methods in this driver support the following patterns of usage:

1. Async / Await
2. Promises
3. Callbacks

You're free to mix and match between these approaches as you see fit.

Here are examples of each:

### Async / Await

```
const cloudcms = require("cloudcms");

const apiKeys = {
    "clientKey": "",
    "clientSecret": "",
    "username": "",
    "password": ""    
};

var repositoryId = "f49e621853c33f501377";
var branchId = "master";
var nodeId = "821c40ab613d9b5bcbbc656b62229332";

(async function() {

    var session = await cloudcms.connect(apiKeys);
        
    // read node
    var node = await session.readNode(repositoryId, branchId, nodeId);
    
    // log result
    console.log("Found node:" + node.title);
})();
```

### Promises

```
const cloudcms = require("cloudcms");

const apiKeys = {
    "clientKey": "",
    "clientSecret": "",
    "username": "",
    "password": ""    
};

var repositoryId = "f49e621853c33f501377";
var branchId = "master";

cloudcms.connect(apiKeys).then(function(session) {

    // read node   
    session.readNode(repositoryId, branchId, nodeId).then(function(node) {
    
        // log result
        console.log("Found node:" + node.title);    
    });

});
```

### Callbacks

```
const cloudcms = require("cloudcms");

const apiKeys = {
    "clientKey": "",
    "clientSecret": "",
    "username": "",
    "password": ""    
};

var repositoryId = "f49e621853c33f501377";
var branchId = "master";

cloudcms.connect(apiKeys, function(err, session) {

    // read node   
    session.readNode(repositoryId, branchId, nodeId, function(err, node) {
    
        // log result
        console.log("Found node:" + node.title);    
    });

});
```

## API Keys

You can either pass in your API Keys object to the `connect()` method or you can have the driver pick up the
API keys from the following files in the local directory:

- `gitana.json`
- `cloudcms.json`

For example, the following code will simply read from disk:

```
const cloudcms = require("cloudcms");

var repositoryId = "f49e621853c33f501377";
var branchId = "master";
var nodeId = "821c40ab613d9b5bcbbc656b62229332";

(async function() {

    var session = await cloudcms.connect();
        
    // read node
    var node = await session.readNode(repositoryId, branchId, nodeId);
    
    // log result
    console.log("Found node:" + node.title);
})();
```

## Custom Session

You can supply your own session implementations to add your own methods.

Define your session class:

```
var DefaultSession = require("cloudcms/session/default/session");

class CustomSession extends DefaultSession
{
    /**
     * Creates an article.
     *
     * @param repository
     * @param branch
     * @param obj
     */
    createArticle(repository, branch, obj)
    {
        var callback = this.extractOptionalCallback(arguments);
    
        if (!obj) {
            obj = {};
        }
        
        obj._type = "my:article";
        
        // call through to the createNode method on the default session
        return this.createNode(repository, branch, obj, callback);
    }
}

module.exports = CustomSession;
```

This extends the `session` object with a new method called `createArticle`.

And then do the following to use it:

```
const cloudcms = require("cloudcms");

(async function() {

    var customSession = require("custom-session");
    cloudcms.session(customSession);

    var session = await cloudcms.connect();
    
    var article = await session.createArticle(repository, branch, { "title": "Hello World" });

})();
```

If you want to add a new asynchronous method that adhere to the session's async support for callbacks, Promises and/or
await/async, you can use the `Helper.sessionFunction` method like this:

```
var DefaultSession = require("cloudcms/session/default/session");
var Helper = require("cloudcms/helper");

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
```


## Custom Storage

TODO: how to configure Memory vs Redis

## Custom Driver

TODO: how to configure a custom driver (XHR, etc)

## Custom Cache

TODO: how to configure custom caching for JSON responses

## Session

When a session connects, it maintains an Access Token and a Refresh Token.  The Access Token is passed as a bearer
token via the `Authorization` header.  If the Access Token expires, the Refresh Token is used to acquire a new
Access Token.

### Automatic Reauthentication

If the Refresh Token expires, you will need to re-authenticate.

You can set this up to happen automatically by using the `reauthenticate` method, like this:

```
session = await cloudcms.connect();

session.reauthenticate(function(done) {

    // re-connect and use the done() function to pass back the new session
    cloudcms.connect(function(err, newSession) {
        done(err, newSession);
    });
});
```

### Manually refresh the Access Token

You can manually refresh the access token (using your Refresh Token) like this:

```
await session.refresh();
```

### Expire the Access / Refresh Token

You can also manually expire the issued Access and Refresh Token, like this:

```
await session.disconnect();
```

### Automatic Reauthentication

## Tests

This library uses Mocha and Chai for testing.

To run all tests:

```
npm run alltests
```

To run a single test (`node`):

```
npm run test node
```
