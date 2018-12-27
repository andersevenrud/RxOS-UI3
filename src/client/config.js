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
// This is the client configuration tree.
// https://manual.os-js.org/v3/config/#client
//

const development = process.env.SKYLARK_DEVELOPMENT === 'true';
const login = development
  ? {username: 'guest', password: 'guest'}
  : {};

const stamp = `Skylark ${OSJS_VERSION} &copy; 2018 Outernet Inc`;

module.exports = {
  auth: {
    login,
    ui: {
      title: '',
      logo: {
        position: 'top',
        src: require('./splash.png'),
        stamp
      }
    }
  },
  desktop: {
    lock: true,
    contextmenu: {
      enabled: true,
      defaults: false
    },

    settings: {
      background: {
        src: require('./wallpaper.png'),
        color: '#089bd2',
        style: 'cover'
      },
      iconview: {
        enabled: false
      }
    }
  },
  vfs: {
    defaultPath: 'home:/',
    mountpoints: [{
      name: 'osjs',
      label: 'Skylark',
      adapter: 'system',
      icon: {name: 'folder-publicshare'}
    }, {
      name: 'home',
      label: 'Home',
      adapter: 'system',
      icon: {name: 'user-home'}
    }, {
      name: 'downloads',
      label: 'Downloads',
      adapter: 'system',
      icon: {name: 'user-home'}
    }]
  },
  skylark: {
    stamp
  }
};
