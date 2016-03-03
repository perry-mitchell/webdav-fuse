(function(module) {

    "use strict";

    const   WebDAVClient = require("./WebDAVClient.js"),
            FUSEInterface = require("./FUSEInterface.js");

    module.exports = {

        mount: function(webdavAddress, credentials, localPath) {
            let client = credentials ?
                new WebDAVClient(webdavAddress, credentials.username, credentials.password) :
                new WebDAVClient(webdavAddress);
            let fuseInterface = new FUSEInterface(client, localPath);
        }

    };

})(module);
