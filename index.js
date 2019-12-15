/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Emanuel Kluge (http://emanuel-kluge.de/)
 */
'use strict';

const fs = require('fs');
const { ExifImage } = require('exif');
const iptc = require('node-iptc');

const NO_EXIF_SEGMENT = 'NO_EXIF_SEGMENT';

const isError = (err) => err && err.code !== NO_EXIF_SEGMENT;

const hasNoExifData = (err) => err && err.code === NO_EXIF_SEGMENT;

const getExifData = (image) =>
  new Promise((resolve, reject) => {
    const extractor = new ExifImage({ image }, (err, data) => {
      if (isError(err)) {
        return reject(err);
      }
      const exif = hasNoExifData(err) ? extractor.exifData : data;
      return resolve({ exif });
    });
  });

const getIptcData = (image) =>
  new Promise((resolve, reject) =>
    fs.readFile(image, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve({ iptc: iptc(data) || {} });
    })
  );

const mergeResults = (done) => (results) => {
  const merged = results.reduce(
    (acc, item) => Object.assign({}, acc, item),
    {}
  );
  return done(null, `module.exports = ${JSON.stringify(merged)};`);
};

module.exports = function exifLoader() {
  if (this.cacheable) {
    this.cacheable();
  }
  const done = this.async();

  Promise.all([getExifData(this.resourcePath), getIptcData(this.resourcePath)])
    .then(mergeResults(done))
    .catch(done);
};
