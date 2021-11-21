const path = require('path');
const webpack4 = require('webpack');
const webpack5 = require('webpack5');
/* eslint-disable-next-line node/no-unpublished-require */
const test = require('tape');

const webpackVersions = { webpack5 };

const nodeVersionLowerThan17 = () =>
  Number(process.versions.node.split('.').shift()) < 17;

if (nodeVersionLowerThan17()) {
  Object.assign(webpackVersions, { webpack4 });
}

const isValidFileIdentifier = (filename) =>
  Boolean(/^[\da-f]{20}\.jpg$/i.exec(filename));

const getLoader = (webpackVersion, withFile = false) => {
  const exifLoader = require.resolve('..');
  const fileLoader =
    webpackVersion === 5
      ? {
          resourceQuery: /^\?file$/,
          type: 'asset/resource',
          generator: {
            filename: '[contenthash:20][ext]',
          },
        }
      : {
          resourceQuery: /^\?file$/,
          use: {
            loader: 'file-loader',
            options: { name: '[contenthash:20].[ext]' },
          },
        };

  if (withFile) {
    return {
      test: /\.jpg$/,
      oneOf: [
        {
          resourceQuery: /^\?exif$/,
          use: exifLoader,
        },
        fileLoader,
      ],
    };
  }
  return {
    test: /\.jpg$/,
    use: exifLoader,
  };
};

const createBundler = (wp, loader) => (name) =>
  new Promise((resolve, reject) =>
    wp(
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
          publicPath: '',
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

Object.entries(webpackVersions).forEach(([name, wp]) => {
  const webpackVersion = Number(name.replace('webpack', ''));
  const bundle = createBundler(wp, getLoader(webpackVersion));
  const bundleWithFile = createBundler(wp, getLoader(webpackVersion, true));

  test(`[${name}] Has Exif/IPTC data`, async (t) => {
    t.plan(2);
    const { exif, iptc } = await bundle('exif');

    t.equal(exif.image.XResolution, 240);
    t.equal(iptc.headline, 'Image title');
  });

  test(`[${name}] Has Exif/IPTC data & file`, async (t) => {
    t.plan(3);
    const {
      exif,
      iptc,
      file: fileExport,
    } = await bundleWithFile('exif-and-file');
    const file =
      typeof fileExport === 'string' ? fileExport : fileExport.default;

    t.equal(exif.image.XResolution, 240);
    t.equal(iptc.headline, 'Image title');
    t.ok(isValidFileIdentifier(file));
  });

  test(`[${name}] Has no Exif/IPTC data`, async (t) => {
    t.plan(3);
    const { exif, iptc } = await bundle('no-exif');

    t.ok(exif.image);
    t.notOk(iptc.headline);
    t.notOk(exif.image.XResolution);
  });

  test(`[${name}] Has no Exif/IPTC data, but file`, async (t) => {
    t.plan(3);
    const {
      exif,
      iptc,
      file: fileExport,
    } = await bundleWithFile('no-exif-but-file');
    const file =
      typeof fileExport === 'string' ? fileExport : fileExport.default;

    t.notOk(exif.image.XResolution);
    t.notOk(iptc.headline);
    t.ok(isValidFileIdentifier(file));
  });
});
