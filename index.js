
/*
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Emanuel Kluge (http://emanuel-kluge.de/)
*/

const ExifImage = require('exif').ExifImage;

const NO_EXIF_SEGMENT = 'NO_EXIF_SEGMENT';

const getFile = (content) => {
    try {
        return { file: eval(content) };
    } catch (e) {
        return {};
    }
};

const isError = err =>
    err && err.code !== NO_EXIF_SEGMENT;

const hasNoExifData = err =>
    err && err.code === NO_EXIF_SEGMENT;

module.exports = function exifLoader(content) {
    if (this.cacheable) {
        this.cacheable();
    }
    const done = this.async();
    const file = getFile(content);
    const extractor = new ExifImage({ image: this.resourcePath }, (err, data) => {
        if (isError(err)) {
            return done(err);
        }
        const exif = hasNoExifData(err) ? extractor.exifData : data;
        const result = Object.assign({ exif }, file);
        return done(null, `module.exports = ${JSON.stringify(result)}`);
    });
};
