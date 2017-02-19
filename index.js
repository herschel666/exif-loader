
/*
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Emanuel Kluge (http://emanuel-kluge.de/)
*/

const fs = require('fs');
const evaluate = require('node-eval');
const ExifImage = require('exif').ExifImage;
const iptc = require('node-iptc');

const NO_EXIF_SEGMENT = 'NO_EXIF_SEGMENT';

const isError = err =>
    err && err.code !== NO_EXIF_SEGMENT;

const hasNoExifData = err =>
    err && err.code === NO_EXIF_SEGMENT;

const getFile = (publicPath, content) => Promise.resolve((() => {
    try {
        return {
            file: evaluate(`__webpack_public_path__='${publicPath}'; ${content}`),
        };
    } catch (e) {
        return {};
    }
})());

const getExifData = image => new Promise((resolve, reject) => {
    const extractor = new ExifImage({ image }, (err, data) => {
        if (isError(err)) {
            return reject(err);
        }
        const exif = hasNoExifData(err) ? extractor.exifData : data;
        return resolve({ exif });
    });
});

const getIptcData = image => new Promise((resolve, reject) =>
    fs.readFile(image, (err, data) => {
        if (err) {
            return reject(err);
        }
        return resolve({ iptc: iptc(data) || {} });
    }));

const mergeResults = done => (results) => {
    const merged = results.reduce((acc, item) => Object.assign({}, acc, item), {});
    return done(null, `module.exports = ${JSON.stringify(merged)};`);
};

module.exports = function exifLoader(content) {
    if (this.cacheable) {
        this.cacheable();
    }
    const done = this.async();
    /* eslint "no-underscore-dangle": 0 */
    const publicPath = this._compilation.outputOptions.publicPath || '/';
    /* eslint "no-underscore-dangle": 1 */
    Promise
        .all([
            getFile(publicPath, content),
            getExifData(this.resourcePath),
            getIptcData(this.resourcePath),
        ])
        .then(mergeResults(done))
        .catch(done);
};
