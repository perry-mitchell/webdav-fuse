(function(module) {

    "use strict";

    const fuse = require("fuse-bindings"),
        path = require("path");

    module.exports = class FUSEInterface {

        constructor(webdavClient, localPath) {
            this._client = webdavClient;
            this._path = path.resolve(localPath);

            this.mount();
        }

        mount() {
            let client = this._client;
            fuse.mount(this._path, {
                // readdir: (path, cb) => {
                //     console.log('readdir(%s)', path);
                //     // client.readdir(path, function(err, contents) {
                //     //     return err ? [] : contents;
                //     // });
                //     client.getDirContents(path)
                //         .then(function(contents) {
                //             console.log("CONTS", contents);
                //             (cb)(contents);
                //         })
                //         .catch(function(err) {
                //             (cb)([]);
                //         });
                // },


              readdir: function (path, cb) {
                console.log('readdir(%s)', path)
                if (path === '/') return cb(0, ['test'])
                cb(0)
              },
              getattr: function (path, cb) {
                console.log('getattr(%s)', path)
                if (path === '/') {
                  cb(0, {
                    mtime: new Date(),
                    atime: new Date(),
                    ctime: new Date(),
                    size: 100,
                    mode: 16877,
                    uid: process.getuid(),
                    gid: process.getgid()
                  })
                  return
                }

                //if (path === '/test') {
                  cb(0, {
                    mtime: new Date(),
                    atime: new Date(),
                    ctime: new Date(),
                    size: 12,
                    mode: 33188,
                    uid: process.getuid(),
                    gid: process.getgid()
                  })
                  return
                //}

                cb(fuse.ENOENT)
              },
              open: function (path, flags, cb) {
                console.log('open(%s, %d)', path, flags)
                cb(0, 42) // 42 is an fd
              },
              read: function (path, fd, buf, len, pos, cb) {
                console.log('read(%s, %d, %d, %d)', path, fd, len, pos)
                var str = 'this is my file!\n'.slice(pos)
                if (!str) return cb(0)
                buf.write(str)
                return cb(str.length)
              }
            });
            process.on('SIGINT', () => {
              fuse.unmount(this._path, function () {
                  process.exit();
                });
            });
        }

    };

})(module);
