/* eslint-disable-next-line node/no-missing-require */
const { exif, iptc } = require('./_has-exif.jpg?exif');
/* eslint-disable-next-line node/no-missing-require */
const file = require('./_has-exif.jpg?file');

module.exports = { exif, iptc, file };
