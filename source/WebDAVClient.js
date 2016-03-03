(function(module) {

    "use strict";

    const WebDAVFS = require("webdav-fs");

    module.exports = class WebDAVClient {

        constructor(webDAVURL, username, password) {
            this.wfs = username && password ? WebDAVFS(webDAVURL, username, password) : WebDAVFS(webDAVURL);
        }

    };

})(module);
