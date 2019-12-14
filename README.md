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

I you have questions, feel free to ping me on twitter:
[@Herschel_R](https://twitter.com/Herschel_R).

## License

The MIT License (MIT)

Copyright (c) 2019 Emanuel Kluge

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
