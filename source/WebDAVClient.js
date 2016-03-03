(function(module) {

    "use strict";

    const WebDAVFS = require("webdav-fs");

    module.exports = class WebDAVClient {

        constructor(webDAVURL, username, password) {
            this.wfs = username && password ? WebDAVFS(webDAVURL, username, password) : WebDAVFS(webDAVURL);
        }

        getDirContents(dir) {
            return new Promise((resolve, reject) => {
                this.wfs.readdir(dir, function(err, contents) {
                    if (err) {
                        (reject)(err);
                    } else {
                        (resolve)(contents);
                    }
                });
            });
        }

    };

})(module);
