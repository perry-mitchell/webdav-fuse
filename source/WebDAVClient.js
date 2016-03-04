(function(module) {

    "use strict";

    const WebDAVFS = require("webdav-fs");

    module.exports = class WebDAVClient {

        constructor(webDAVURL, username, password) {
            this.wfs = username && password ? WebDAVFS(webDAVURL, username, password) : WebDAVFS(webDAVURL);
            this._cache = {};
        }

        createCache(keyParts, execFn, cb) {
            let cache = this._cache,
                key = keyParts.join("#");
            console.log("CREATE CACHE:", key);
            cache[key] = [cb];
            (execFn)(function() {
                let items = cache[key],
                    args = Array.prototype.slice.call(arguments);
                delete cache[key];
                console.log("REMOVE CACHE:", key);
                items.forEach((item) => {
                    item.apply(null, args);
                });
            });
        }

        getDirContents(dir) {
            return new Promise((resolve, reject) => {
                let handler = function(err, contents) {
                    if (err) {
                        (reject)(err);
                    } else {
                        (resolve)(contents);
                    }
                };
                if (this.hasCache(["readdir", dir])) {
                    this.waitForCache(["readdir", dir], handler);
                } else {
                    console.log("NO_CACHE:", ["readdir", dir].join("#"));
                    this.createCache(
                        ["readdir", dir],
                        (doneFn) => {
                            this.wfs.readdir(dir, doneFn);
                        },
                        handler
                    );
                }
            });
        }

        hasCache(keyParts) {
            let key = keyParts.join("#");
            return this._cache[key] && true;
        }

        waitForCache(keyParts, cb) {
            let key = keyParts.join("#");
            this._cache[key].push(cb);
        }

    };

})(module);
