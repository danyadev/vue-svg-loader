# vue-svg-loader

__Данная версия работает только для Vue `3.0`__.

Это загрузчик для Webpack, который создает .vue файл из .svg файла, в котором можно добавлять свои свойства и подписываться на события.

## Установка

```bash
$ yarn add -D danyadev/vue-svg-loader#next
```

## Подключение

### В webpack.config.js

```js
{
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'vue-svg-loader'
      }
    ]
  }
}
```

В данном случае все импортируемые .svg файлы станут Vue компонентами.

```js
// Logo - Vue компонент

import Logo from './assets/logo.svg';
// или
const Logo = require('./assets/logo.svg').default;
```

### Напрямую при импорте

В таком случае не нужно добавлять правило для конфига вебпака.

```js
// Logo - Vue компонент

import Logo from '!vue-svg-loader!./assets/logo.svg';
// или
const Logo = require('!vue-svg-loader!./assets/logo.svg').default;
```
