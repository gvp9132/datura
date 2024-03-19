[toc]
# Webpack 学习

## 优化


### cache缓存

* 开启babel和eslin的本地缓存

```js
// loader
 {
    // 处理js文件
    test: /\.js$/,
    // 排除node_modules文件夹,不处理node_modules文件夹中的js文件
    exclude: "/node_modules",
    loader: 'babel-loader',
    options: {
        // 开启缓存
        cacheDirectory: true,
        // 关闭缓存压缩
        cacheCompression: false
    }
  }

// 插件
  new ESLintWebpackPlugin({
            context: 'src',
            exclude: ['node_modules'],
            // 开启eslint缓存
            cache: true,
            // 设置缓存的目录
            //cacheLocation: 'node_modules/.cache/.eslintcache',
        }),
```
