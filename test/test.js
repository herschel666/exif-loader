const path = require('path');
/* eslint-disable-next-line node/no-unpublished-require */
const test = require('tape');
const exifLoader = require('../');

const IMG_EXIF = path.join(__dirname, 'has-exif.jpg');
const IMG_NO_EXIF = path.join(__dirname, 'has-no-exif.jpg');

const getContext = (img, cb) => ({
  async: () => cb,
  resourcePath: img,
  _compilation: { outputOptions: {} },
});

test('Has Exif/IPTC data', (t) => {
  t.plan(3);
  exifLoader.call(
    getContext(IMG_EXIF, (_, data) => {
      const result = eval(data);
      t.equal(result.exif.image.XResolution, 240);
      t.equal(result.iptc.headline, 'Image title');
      t.notOk(result.file);
    })
  );
});

test('Has Exif/IPTC data & file', (t) => {
  const file = path.basename(IMG_EXIF);
  const content = `module.exports = "./${file}"`;
  t.plan(3);
  exifLoader.call(
    getContext(IMG_EXIF, (_, data) => {
      const result = eval(data);
      t.equal(result.exif.image.XResolution, 240);
      t.equal(result.iptc.headline, 'Image title');
      t.equal(result.file, `./${file}`);
    }),
    content
  );
});

test('Has no Exif/IPTC data', (t) => {
  t.plan(3);
  exifLoader.call(
    getContext(IMG_NO_EXIF, (_, data) => {
      const result = eval(data);
      t.ok(result.exif.image);
      t.notOk(result.iptc.headline);
      t.notOk(result.exif.image.XResolution);
    })
  );
});

test('Has no Exif/IPTC data & file', (t) => {
  const file = path.basename(IMG_NO_EXIF);
  const content = `module.exports = "./${file}"`;
  t.plan(3);
  exifLoader.call(
    getContext(IMG_NO_EXIF, (_, data) => {
      const result = eval(data);
      t.notOk(result.exif.image.XResolution);
      t.notOk(result.iptc.headline);
      t.equal(result.file, `./${file}`);
    }),
    content
  );
});
