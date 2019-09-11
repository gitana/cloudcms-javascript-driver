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

## Extending Session Methods

To add new Session methods, register a new session extension:

```
var Extensions = require("cloudcms/extensions");

var extendFn = function(Session, Helper)
{
    class c extends Session {

        constructor(config, driver, storage)
        {
            super(config, driver, storage)
        }

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
            
            return this.createNode(repository, branch, obj, callback);
        }
    }

    return c;
};

Extensions.session("custom", extendFn);
```

This extends the `session` object with a new method called `createArticle`.


## Tests

This library uses Mocha and Chai for testing.

To run all tests:

```
npm test
```

To run a single test (`node`):

```
npm test -- --grep node
```