const path = require('path');
const webpack = require('webpack');
/* eslint-disable-next-line node/no-unpublished-require */
const test = require('tape');

const isValidFileIdentifier = (filename) =>
  Boolean(/^[\da-f]{32}\.jpg$/i.exec(filename));

const getLoader = (withFile = false) => {
  const exifLoader = require.resolve('..');

  if (withFile) {
    return {
      test: /\.jpg$/,
      oneOf: [
        {
          resourceQuery: /^\?exif$/,
          use: exifLoader,
        },
        {
          resourceQuery: /^\?file$/,
          use: ['file-loader'],
        },
      ],
    };
  }
  return {
    test: /\.jpg$/,
    use: exifLoader,
  };
};

const createBundler = (loader) => (name) =>
  new Promise((resolve, reject) =>
    webpack(
      {
        mode: 'development',
        devtool: false,
        get entry() {
          return path.join(__dirname, 'fixture', this.output.filename);
        },
        output: {
          libraryTarget: 'commonjs2',
          path: path.join(__dirname, 'output'),
          filename: `${name}.js`,
        },
        module: {
          rules: [loader],
        },
      },
      (err, stats) => {
        if (err) {
          return reject(err);
        }
        if (stats.hasErrors()) {
          return reject(stats.compilation.errors[0]);
        }
        if (stats.hasWarnings()) {
          return reject(stats.compilation.warnings[0]);
        }

        resolve(require(`./output/${name}`));
      }
    )
  );

const bundle = createBundler(getLoader());
const bundleWithFile = createBundler(getLoader(true));

test('Has Exif/IPTC data', async (t) => {
  t.plan(2);
  const { exif, iptc } = await bundle('exif');

  t.equal(exif.image.XResolution, 240);
  t.equal(iptc.headline, 'Image title');
});

test('Has Exif/IPTC data & file', async (t) => {
  t.plan(3);
  const {
    exif,
    iptc,
    file: { default: file },
  } = await bundleWithFile('exif-and-file');

  t.equal(exif.image.XResolution, 240);
  t.equal(iptc.headline, 'Image title');
  t.ok(isValidFileIdentifier(file));
});

test('Has no Exif/IPTC data', async (t) => {
  t.plan(3);
  const { exif, iptc } = await bundle('no-exif');

  t.ok(exif.image);
  t.notOk(iptc.headline);
  t.notOk(exif.image.XResolution);
});

test('Has no Exif/IPTC data, but file', async (t) => {
  t.plan(3);
  const {
    exif,
    iptc,
    file: { default: file },
  } = await bundleWithFile('no-exif-but-file');

  t.notOk(exif.image.XResolution);
  t.notOk(iptc.headline);
  t.ok(isValidFileIdentifier(file));
});
