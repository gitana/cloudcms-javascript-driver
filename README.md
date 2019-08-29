# cloudcms-javascript-driver

Updated Cloud CMS JS Driver using modern ECMAScript and Promises

## Installation

```
npm install --save cloudcms
```

## Usage

```
var apiKeys = {
    "clientKey": "",
    "clientSecret": "",
    "username": "",
    "password": ""    
};

var cloudcms = require("cloudcms");
cloudcms.connect(apiKeys, function(err, session, api) {

    if (err) {
        return console.log("Failed to connect", err);
    }
    
    var platform = api.platform();
    var repository = platform.repository("repoId");
    var branch = repository.branch("branchId");

    execute(session, branch);    
});

var execute = async function(session, branch) {
    
    var node = await branch.readNode(session, "nodeId");
    
    console.log("Found node:" + node.title);
});
```