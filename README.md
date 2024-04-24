# babel-debug-plugin
babel插件，用于开发环境下调试所用

该中间件由[`coderlibs `](http://coderlibs.com)官方出品

## Installation
```bash
$ npm install babel-debug-plugin
```

## API

### babel.config.json
```js
{
    "presets": [
        [
            "@babel/preset-env",
            { 
                "useBuiltIns": "usage", // usage 无需额外引入polifllls 会查找brwserlist浏览器做填充，浏览器支持的api不会再补充
                "corejs": "3.22" // 引入这个就行了 无需额外引入polifllls
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime", // 提取单独的辅助函数，避免重复引入
            {
               "corejs": false,
               "helpers": true,
               "regenerator": true,
               "useESModules": true
           }
       ],
       [
        "./node_modules/babel-debug-plugin",{}
       ]
    ]
}
```

### webpack.config.js
```js
const debugPlugin = require('babel-debug-plugin')
module.exports = function (env, argv) {
    return {
        entry: 'main.js',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            "plugins": [
                                debugPlugin,{}
                            ]
                        }
                    }
                },
            ]
        }
    }
}
```
## Options 使用场景
- 支持if判断 
- 支持一元表达式 !
- 支持三元运算符
- 支持逻辑运算符 &&

## 示例
```js
let isFalse = !DEBUG
let isDEV = DEBUG ? true : false
let sum = DEBUG && 666
if (DEBUG) {
  console.log(isFalse,isDEV,sum);
}
```