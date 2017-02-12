EXIF-Loader
====

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
    rules: [{
      test: /\.jpg$/,
      use: ['exif-loader']
    }]
  }
}
```

**modules/a.js**
```js
import { exif } from './some-image.jpg';

const { imageWidth } = exif.image;
```

You can also use the load in tandem with the [url-loader](https://github.com/webpack-contrib/url-loader).

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [{
      test: /\.jpg$/,
      use: ['exif-loader', 'url-loader']
    }]
  }
}
```

**modules/b.js**
```js
import { exif, file } from './some-image.jpg';

const { imageWidth } = exif.image;

export default function () {
    return (
        <img src={file} width={imageWidth} />
    );
}
```

## Contributing

If you stumbled upon a bug or have an idea for improvements, feel free to [open an issue](https://github.com/herschel666/exif-loader/issues).

If you want to contribute code, you're highly welcome to [open a pull-request](https://github.com/herschel666/exif-loader/pulls). Please use a feature-branch for that and make sure, the CI-test is green.

Thanks!

## Questions

I you have questions, feel free to ping me on twitter: [@Herschel_R](https://twitter.com/Herschel_R).
