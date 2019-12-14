# EXIF-Loader

> Extract EXIF- & IPTC-data from your JPGs during build-time.

## Install

```
npm install --save-dev exif-loader
```

## Usage

You can use the EXIF-loader as a standalone loader:

**webpack.config.js**

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.jpg$/,
                use: ['exif-loader'],
            },
        ],
    },
};
```

**modules/a.js**

```js
import { exif, iptc } from './some-image.jpg';

const { imageWidth } = exif.image;
const { object_name } = iptc;
```

You can also use the load in tandem with the [url-loader](https://github.com/webpack-contrib/url-loader).

**webpack.config.js**

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.jpg$/,
                use: ['exif-loader', 'url-loader'],
            },
        ],
    },
};
```

**modules/b.js**

```js
import { exif, iptc, file } from './some-image.jpg';

const { imageWidth } = exif.image;
const { object_name } = iptc;

export default function() {
    return (
        <figure>
            <img src={file} width={imageWidth} alt="" />
            <figcaption>{object_name}</figcaption>
        </figure>
    );
}
```

## Contributing

If you stumbled upon a bug or have an idea for improvements, feel free to [open an issue](https://github.com/herschel666/exif-loader/issues).

If you want to contribute code, you're highly welcome to [open a pull-request](https://github.com/herschel666/exif-loader/pulls). Please use a feature-branch for that and make sure, the CI-test is green.

Thanks!

## Questions

I you have questions, feel free to ping me on twitter: [@Herschel_R](https://twitter.com/Herschel_R).
