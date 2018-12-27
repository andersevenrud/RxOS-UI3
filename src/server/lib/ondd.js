const dgram = require('unix-dgram');

const rand = (max = 1) => Math.random() * max;
const randInt = (max = 1) => Math.round(rand(max));

const debugData = () => ({
  stream: 0,
  td: randInt(255),
  bitrate: 17660,
  packetrate: 20.63,
  lock: 1,
  freq: 11902.4,
  snr: rand(5),
  rssi: -99,
  crc_ok: 865830,
  crc_err: 16,
  freq_offset: -29838,
  freq_offset_uc: -570,
  audio_bitrate: 9519,
  transfers: [{
    carousel_id: 1,
    path: 'opaks/f5d0-gfs.2018122700_gfs.t00z.pgrb2.1p00.f048.grib2.tbz2',
    hash: 'a064d9a86c8a8b2db75a1978e85f4e861160bff8d929f588286e9fc949b6cdf6',
    block_count: 1395,
    block_received: 809,
    complete: 1
  }]
});

class SkylarkOndd {
  constructor(core, callback) {
    this.socket = null;
    this.store = {};
    this.callback = callback || function () {};
  }

  init() {
    this.socket = dgram.createSocket('unix_dgram', d => {
      this.store = Object.assign({}, this.store, JSON.parse(d));

      this.callback(this.store);
    });

    return Promise.resolve();
  }

  status() {
    return Promise.resolve(debugData());
    //    return Promise.resolve(this.store);
  }
}

module.exports = {SkylarkOndd};
