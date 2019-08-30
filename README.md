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

(async function() {

    var session = await cloudcms.connect(apiKeys);

    // services
    var branchService = session.branchService("f49e621853c33f501377", "master");

    // invoke API
    var node = await branchService.readNode(session, "nodeId");
    
    // result
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

cloudcms.connect(apiKeys).then(function(session) {

    // services
    var branchService = session.branchService("f49e621853c33f501377", "master");

    // invoke API   
    branchService.readNode(session, "nodeId").then(function(node) {
    
        // result
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

cloudcms.connect(apiKeys, function(err, session) {

    // services
    var branchService = session.branchService("f49e621853c33f501377", "master");

    // invoke API   
    branchService.readNode(session, "nodeId", function(err, node) {
    
        // result
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

(async function() {

    var session = await cloudcms.connect();

    // services
    var branchService = session.branchService("f49e621853c33f501377", "master");

    // invoke API
    var node = await branchService.readNode(session, "nodeId");
    
    // result
    console.log("Found node:" + node.title);
})();
```
