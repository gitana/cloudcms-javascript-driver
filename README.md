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

    var session = await cloudcms.connect();

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

cloudcms.connect().then(function(session) {

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

cloudcms.connect(function(err, session) {

    // services
    var branchService = session.branchService("f49e621853c33f501377", "master");

    // invoke API   
    branchService.readNode(session, "nodeId", function(err, node) {
    
        // result
        console.log("Found node:" + node.title);    
    });

});
```
