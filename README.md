# cloudcms-javascript-driver

Cloud CMS JavaScript Driver with support for ECMAScript Async, Promises and Callbacks.

For formal support and assistance, please visit <a href="https://gitana.io" title="Gitana Software">https://gitana.io</a>.

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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

## Session

When a session connects, it maintains an Access Token and a Refresh Token.  The Access Token is passed as a bearer
token via the `Authorization` header.  If the Access Token expires, the Refresh Token is used to acquire a new
Access Token.

### Automatic Reauthentication

If the Refresh Token expires, you will need to re-authenticate.

You can set this up to happen automatically by using the `reauthenticate` method, like this:

```javascript
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

```javascript
await session.refresh();
```

### Expire the Access / Refresh Token

You can also manually expire the issued Access and Refresh Token, like this:

```javascript
await session.disconnect();
```

### Band

If you have multiple bands configured, you can configure your Session to perform all of its API calls
against a designated band, like this:

```javascript
session = await cloudcms.connect();
session.useBand("production");
```

To revert back to the default band:

```javascript
session.useBand(null);
```

### TypeScript

The `cloudcms-javascript-driver` includes a TypeScript type interface to improve your editing experience and allow better integration in your TypeScript apps.
Here's a quick example usage:

```typescript
import { GitanaConfig, DefaultSession, PlatformObject, Rows } from 'cloudcms';
import * as CloudCMS from 'cloudcms';

async function myRequest(): Promise<void> {
    var config: GitanaConfig = {
        // ...
    };

    var session: DefaultSession = await CloudCMS.connect(config);

    var repositoryId = "myRepo";
    var branchId = "master";

    var nodes: Rows<Node> = await session.queryNodes(repositoryId, branchId, { "author": "Kurt Vonnegut" });
    nodes.rows.forEach((obj) => {
        console.log(obj._doc);
    })
}

myRequest();
```

You can also provide custom generic types to methods involving nodes to further describe returned node types in your TypeScript application:

```typescript
import { Node, Rows } from 'cloudcms';

interface CustomType extends Node {
    title: String,
    aProp: String,
    bProp: String
}

const results: Rows<CustomType> = await session.queryNodes(repositoryId, branchId, { "_type": "custom:type" });
```

## Tests

This library uses Mocha and Chai for testing.

To test, first add `gitana.json` to the project root.

To run all tests:

```
npm run alltests
```

To run a single test (`node`):

```
npm run test node
```

## Proxy

Configure the driver to use an HTTP or HTTPS proxy using the following environment variables to specify
the location of your proxy endpoint:

- `HTTP_PROXY`
- `HTTPS_PROXY`

If these environment variables are present when connecting to your Session, they will be incorporated 
into the underlying engine's configuration to enable routing through your proxy.

Example:

```javascript
const cloudcms = require("cloudcms");

process.env.HTTPS_PROXY = "http://localhost:9090";
    
(async function() {
    var session = await cloudcms.connect();
    console.log("Connected!");
})();
```

In addition, the following environment variables are supported to prevent certain domains from routing
through the HTTP/HTTPS PROXY endpoints.

- `NO_PROXY`
- `*_PROXY`

For more information, see:
https://github.com/Rob--W/proxy-from-env?tab=readme-ov-file#environment-variables

Example:

```javascript
const cloudcms = require("cloudcms");

process.env.HTTPS_PROXY = "http://localhost:9090";

// route everything through "localhost:9090" except connections to https://api.cloudcms.com
process.env.NO_PROXY = "api.cloudcms.com";
    
(async function() {
    var session = await cloudcms.connect();
    console.log("Connected!");
})();
```

## Custom Engine

Use the `engine()` method to select the underlying HTTP client engine to use for connectivity to the API.
The following engines are supported:

- `axios`
- `fetch`

You can either pass in text (`axios` or `fetch`) to identify the engine you wish to use.  Or you can pass in
a reference to the class for the engine you wish to use.

Example #1:

```javascript
const cloudcms = require("cloudcms");

(async function() {

    cloudcms.engine("fetch");

    var session = await cloudcms.connect();
    console.log("Connected!");
})();
```

Example #2:

```javascript
const cloudcms = require("cloudcms");

(async function() {

    cloudcms.engine(cloudcms.FetchEngine);

    var session = await cloudcms.connect();
    console.log("Connected!");
})();
```

You can also customize the configuration options for a given engine.  For example, you could configure
the Axios engine's options as shown below to provide your own custom HTTPS agent:

```javascript
const cloudcms = require("cloudcms");
const { HttpsProxyAgent} = require("https-proxy-agent");

(async function() {

    cloudcms.engine("axios", {
        proxy: false,
        httpsAgent: new HttpsProxyAgent("http://localhost:9090")
    });

    var session = await cloudcms.connect(apiKeys);
    console.log("Connected!");
})();
```

## Custom Storage

TODO: how to configure Memory vs Redis

## Custom Cache

TODO: how to configure custom caching for JSON responses

## Documentation

Please visit:

https://gitana.io/documentation/gitana/4.0/developers/cookbooks/javascript2.html
https://gitana.io/documentation/gitana/4.0/developers/drivers/javascript.html

## Support

For support, please visit https://gitana.io
