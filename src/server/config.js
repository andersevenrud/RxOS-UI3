/*!
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2018, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */

//
// This is the server configuration tree.
// https://manual.os-js.org/v3/config/#client
//

const path = require('path');
const root = path.resolve(__dirname, '../../');
const development = process.env.SKYLARK_DEVELOPMENT === 'true';
const imageRoot = development ? path.resolve(root, 'target') : path.resolve('/');
const vfsRoot = development ? path.resolve(root, 'vfs') : path.resolve('/home');

module.exports = {
  root,
  port: 8080,
  public: path.resolve(root, 'dist'),
  vfs: {
    root: vfsRoot,
    mountpoints: [{
      name: 'downloads',
      attributes: {
        root: path.resolve(imageRoot, 'mnt/downloads')
      }
    }]
  },
  skylark: {
    development,

    auth: {
      binary: path.resolve(imageRoot, 'usr/bin/checkpass.sh')
    },

    config: {
      file: path.resolve(imageRoot, 'etc/skylark_config.json'),
      confd: path.resolve(imageRoot, 'etc/skylark/conf.d/'),
      write_path: path.resolve(imageRoot, 'mnt/conf/etc/'),
      write_config: path.resolve(imageRoot, 'mnt/conf/etc/skylark_config.json')
    }
  }
}
