[toc]
# Webpack 学习

## 优化

## 使用多线程进行打包

* 配置loader
* 安装
```js
    npm i thread-loader -D
```
* 配置
```js
const os = require('os');
// 引入压缩插件
const TerserPlugin = require('terser-webpack-plugin');
// 获取cpu核心数量
const threads = os.cpus().length - 2;

// 配置加载器
  {
                        // 处理js文件
                        test: /\.js$/,
                        // 排除node_modules文件夹,不处理node_modules文件夹中的js文件
                        exclude: "/node_modules",
                        use: [
                            {
                                loader: 'thread-loader',
                                options: {
                                    workers: threads
                                }
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    // 开启缓存
                                    cacheDirectory: true,
                                    // 关闭缓存压缩
                                    cacheCompression: false
                                }
                            }
                        ],
                    }
// 配置插件
// 在插件中移除 CssMinimizerPlugin,在跟标签配置optimization
// 处理压缩的插件
optimization: {
    minimizer: [
        // 压缩css
        new CssMinimizerPlugin(),
        // 压缩js
        new TerserPlugin({
            // 开启多线程
            parallel: threads,
        })
    ]
},
```


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
