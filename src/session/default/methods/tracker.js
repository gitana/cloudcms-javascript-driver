module.exports = function(Session)
{
    class TrackerSession extends Session
    {
        constructor(config, driver, storage)
        {
            super(config, driver, storage);

            let trackerConfig = { ...this.config };

            if (!trackerConfig.applicationId) {
                trackerConfig.applicationId = this.config.application;
            }
            if (!trackerConfig.deploymentKey) {
                trackerConfig.deploymentKey = "default";
            }
            
            this.trackerConfig = trackerConfig;
            this.dispatcher = TrackerSession.buildDispatcher(trackerConfig, this.trackBulk.bind(this));
        }

        trackBulk(rows, callback) {
            var uri = "/bulk/pagerenditions";
            var qs = {};
            var payload = {
                "rows": rows
            };
            console.log("Tracking: " + payload.rows.map(row => row.object.page.url))
            
            this.post(uri, qs, payload, function (err) {
                callback();
            });
        }

        /**
         * Marks a page cache element as dependent on a set of dependencies.
         *
         * This calls over to Cloud CMS to register a page rendition described by "descriptor" as being dependent on the "dependencies".
         *
         * Request should look like:
         *
         *  {
         *      url,
         *      path, (required)
         *      host,
         *      protocol,
         *      headers,
         *      params
         *  }
         *
         * Page should look like:
         *
         *  {
         *      id,
         *      title,
         *      url,
         *      path, (required)
         *      tokens,
         *      attributes
         *  }
         *
         *  And dependencies should look like:
         *
         *  {
         *      "requires": {
         *         "locale": ["en-US"]
         *      },
         *      "produces": {
         *         "node": ["abc123", "def456"]
         *      }
         *  }
         *
         * @type {Function}
         */
        track(repositoryId, branchId, request, page, dependencies)
        {
            if (!request) {
                request = {};
            }
            
            if (!page) {
                page = {};
            }
            
            // request.path is mandatory
            if (!request.path)
            {
                throw new Error("The incoming request does not have a required 'path' field");
            }
            
            if (!request.id) {
                request.id = request.path;
            }
            if (!request.url) {
                request.url = this.buildURL(request.path);
            }
            
            // page.path is mandatory
            if (!page.path) {
                throw new Error("The incoming page does not have a required 'path' field");
            }
            
            if (!page.id) {
                page.id = page.path;
            }
            if (!page.url) {
                page.url = this.buildURL(page.path);
            }
            
            // empty dependencies if not defined
            if (!dependencies) {
                dependencies = {};
            }
            
            // assume a unique cache key for the page
            var pageCacheKey = TrackerSession.generatePageCacheKey(request, page);
            
            var renditionObject = {
                "key": pageCacheKey,
                "page": page,
                "pageCacheKey": pageCacheKey,
                "request": request,
                "dependencies": dependencies,
                "active": true,
                "scope": "PAGE"
            };
            
            // push row to dispatcher
            this.dispatcher.push(repositoryId, branchId, renditionObject);
        }

        trackPathHtml(repositoryId, branchId, path, html)
        {
            var ids = TrackerSession.parse(html);
            if (ids && ids.length > 0)
            {
                //console.log("Found ids: " + ids + " for path: " + path);
                
                var request = {
                    "path": path
                };
                
                var page = {
                    "path": path
                };
                
                var dependencies = {
                    "requires": {},
                    "produces": {
                        "node": ids
                    }
                }
                
                this.track(repositoryId, branchId, request, page, dependencies, function(err) {
                    // done
                });
            }
        }

        buildURL(_path)
        {
            
            if (!_path.startsWith("/")) {
                _path = "/" + _path;
            }

            var _url = _path;
            if (this.trackerConfig.basePageUrl) {
                _url = this.trackerConfig.basePageUrl + _path;
            }
            
            return _url;
        }

        static generatePageCacheKey(request, page)
        {   
            // sort request params alphabetically
            var paramNames = [];
            if (request.params) {
                for (var paramName in request.params) {
                    paramNames.push(paramName);
                }
            }
            paramNames.sort();
            
            // sort page attributes alphabetically
            var pageAttributeNames = [];
            if (page.attributes) {
                for (var pageAttributeName in page.attributes) {
                    pageAttributeNames.push(pageAttributeName);
                }
            }
            pageAttributeNames.sort();
            
            // TODO: headers
            /*
            // sort headers alphabetically
            var headerNames = [];
            for (var headerName in request.headers) {
                headerNames.push(headerName);
            }
            headerNames.sort();
            */
            
            var str = page.path;
            
            // add in param names
            for (var i = 0; i < paramNames.length; i++)
            {
                var paramName = paramNames[i];
                var paramValue = request.params[paramName];
                
                if (typeof(paramValue) !== "undefined" && paramValue !== null)
                {
                    str += "&param_" + paramName + "=" + paramValue;
                }
            }
            
            // add in page attribute names
            for (var i = 0; i < pageAttributeNames.length; i++)
            {
                var pageAttributeName = pageAttributeNames[i];
                var pageAttributeValue = page.attributes[pageAttributeName];
                
                if (typeof(pageAttributeValue) !== "undefined" && pageAttributeValue !== null)
                {
                    str += "&attr_" + pageAttributeName + "=" + pageAttributeValue;
                }
            }
            
            /*
            // add in header names
            for (var i = 0; i < headerNames.length; i++)
            {
                var headerName = headerNames[i];
                var headerValue = request.headers[headerName];
                str += "&header_" + headerName + "=" + headerValue;
            }
            */
            
            // hand back a hash
            return "" + TrackerSession.hash(str);
        }

        static hash(str, seed = 31) {
            let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
            for (let i = 0, ch; i < str.length; i++) {
                ch = str.charCodeAt(i);
                h1 = Math.imul(h1 ^ ch, 2654435761);
                h2 = Math.imul(h2 ^ ch, 1597334677);
            }
            h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
            h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
            return 4294967296 * (2097151 & h2) + (h1>>>0);
        };
    
        static parse(html)
        {
            var ids = [];
            
            var text = "" + html.toLowerCase();
            
            var done = false;
            while (!done)
            {
                var i1 = text.indexOf("data-cms-id");
                if (i1 > -1)
                {
                    text = text.substring(i1 + 11);
                    
                    var i2 = text.indexOf("=\"");
                    if (i2 == -1) {
                        i2 = text.indexOf("='");
                    }
                    
                    if (i2 > -1)
                    {
                        text = text.substring(i2 + 2);
                        
                        var i3 = text.indexOf("\"");
                        if (i3 == -1) {
                            i3 = text.indexOf("'");
                        }
                        
                        if (i3 > -1)
                        {
                            var id = text.substring(0, i3);
                            
                            text = text.substring(i3 + 1);
                            
                            ids.push(id);
                        }
                    }
                }
                else
                {
                    done = true;
                }
            }
            
            return ids;
        };

        static buildDispatcher(trackerConfig, syncFn) {
    
            const TIMEOUT_MS = 250;
            let QUEUE = [];
            
            let timeout = null;
            
            let send = () =>
            {
                // chew off a bit of the queue that we'll send
                var queueLength = QUEUE.length;
                if (queueLength === 0) {
                    // we're done
                    
                    // clear timeout if it's hanging on
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    
                    return;
                }
                
                // if queue length > 50, we trim back
                if (queueLength > 50) {
                    queueLength = 50;
                }
                
                var rows = [];
                for (var i = 0; i < queueLength; i++) {
                    rows.push(QUEUE[i]);
                }
                
                // strip down the queue
                QUEUE = QUEUE.slice(queueLength);
                
                // send rows via HTTP
                syncFn(rows, function() {
                    console.log("Sent " + rows.length + " rows to API");
                    
                    // run again right away
                    setTimeout(send, 1);
                });
            }
            
            let r = {};
            
            r.push = (repositoryId, branchId, o) => {
            
                o.repositoryId = trackerConfig.repositoryId;
                o.branchId = trackerConfig.branchId;
        
                var row = {};
                row.applicationId = trackerConfig.applicationId;
                row.deploymentKey = trackerConfig.deploymentKey;
                row.object = o;
                
                QUEUE.push(row);
                
                // if not already scheduled, schedule it
                if (!timeout) {
                    timeout = setTimeout(send, TIMEOUT_MS);
                }
            };
            
            return r;
        };
    }

    return TrackerSession;
};