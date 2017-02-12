
const path = require('path');
const test = require('tape');
const exifLoader = require('../');

const IMG_EXIF = path.join(__dirname, 'has-exif.jpg');
const IMG_NO_EXIF = path.join(__dirname, 'has-no-exif.jpg');

const getContext = (img, cb) => ({
    async: () => cb,
    resourcePath: img,
});

test('Has Exif data', (t) => {
    t.plan(2);
    exifLoader.call(getContext(IMG_EXIF, (_, data) => {
        const result = eval(data);
        t.equal(result.exif.image.ImageWidth, 960);
        t.notOk(result.file);
    }));
});

test('Has Exif data & file', (t) => {
    const file = path.basename(IMG_EXIF);
    const content = `module.exports = "./${file}"`;
    t.plan(2);
    exifLoader.call(getContext(IMG_EXIF, (_, data) => {
        const result = eval(data);
        t.equal(result.exif.image.ImageWidth, 960);
        t.equal(result.file, `./${file}`);
    }), content);
});

test('Has no Exif data', (t) => {
    t.plan(2);
    exifLoader.call(getContext(IMG_NO_EXIF, (_, data) => {
        const result = eval(data);
        t.ok(result.exif.image);
        t.notOk(result.exif.image.ImageWidth);
    }));
});

test('Has Exif data & file', (t) => {
    const file = path.basename(IMG_NO_EXIF);
    const content = `module.exports = "./${file}"`;
    t.plan(2);
    exifLoader.call(getContext(IMG_NO_EXIF, (_, data) => {
        const result = eval(data);
        t.ok(result.exif.image);
        t.equal(result.file, `./${file}`);
    }), content);
});
