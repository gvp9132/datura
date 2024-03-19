const path = require('path');
const os = require('os');
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const threads = os.cpus().length - 2;

/**
 *  获取样式加载器
 * @param {String} pre 前置loader
 */
function getStyleLoaders(pre) {
    return [
        MiniCssExtractPlugin.loader, // 提取css到单独文件
        'css-loader', // 转换css
        // 配置postcss
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            "postcss-preset-env",
                            {
                                // Options
                            },
                        ],
                    ],
                },
            },
        },
        pre // 前置loader
    ].filter(Boolean) // 过滤掉空的loader
}


// const path = require('path');
module.exports = {
    // 入口文件,这里不可以写 /src/main.js,系统自动找到,即使不写也可以找到 ./src/app.js 需要写
    entry: './src/main.js',
    // 出口文件
    output: {
        // 入口文件打包输出文件名
        filename: 'static/js/bundle.js',
        // 生产模式输出路径,因为配置文件是在config文件夹下,所以需要使用path模块../dist
        path: path.resolve(__dirname, '../dist'),
        // 打包之前清除dist文件夹
        clean: true
    },
    // 模块加载器
    module: {
        rules: [
            // loader配置
            {
                oneOf: [
                    {
                        // 匹配css文件
                        test: /\.css$/,
                        use: getStyleLoaders()
                    },
                    {
                        // 匹配less文件
                        test: /\.less$/,
                        // 使用loader(从右向左执行,从下到上执行)
                        use: getStyleLoaders('less-loader')
                    },
                    {
                        // 匹配scss文件
                        test: /\.sass$/,
                        // 使用loader(从右向左执行,从下到上执行)
                        use: getStyleLoaders('sass-loader')
                    },
                    {
                        // 图片loader
                        test: /\.(png|jpe?g|gif|webp|svg)$/,
                        type: 'asset',
                        // 使用loader(从右向左执行,从下到上执行)
                        parser: {
                            dataUrlCondition: {
                                // 20kb以下的图片转为base64
                                maxSize: 20 * 1024
                            }
                        },
                        generator: {
                            // 输出图片的名称/hash(文件哈希值)/ext(文件扩展名)/query(文件查询字符串)
                            filename: 'static/images/[hash:10][ext][query]'
                        }
                    },
                    {
                        // 处理字体文件
                        test: /\.(ttf|woff2?)$/,
                        type: 'asset/resource',
                        generator: {
                            // 输出图片的名称/hash(文件哈希值)/ext(文件扩展名)/query(文件查询字符串)
                            filename: 'static/media/[hash:10][ext][query]'
                        }
                    },
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
                                    cacheCompression: false ,
                                    plugins: [
                                        // 减少冗余代码
                                        "@babel/plugin-transform-runtime",
                                    ]
                                }
                            }
                        ],
                    }
                ]
            }
        ]
    },
    // 插件
    plugins: [
        // 插件配置
        // 配置eslint
        new ESLintWebpackPlugin({
            // 配置需要检查的文件夹
            context: 'src',
            exclude: ['node_modules'],
            // 开启eslint缓存
            cache: true,
            // 设置缓存的目录
            //cacheLocation: 'node_modules/.cache/.eslintcache',
            // 开启eslin的多线程处理
            threads,
        }),
        // 配置html
        new HtmlWebpackPlugin({
            // 模板文件,根据模板文件生成html文件,模板文件中可以写html代码
            template: 'public/index.html'
        }),
        new MiniCssExtractPlugin({
            // 输出css文件的名称
            filename: 'static/css/[name].css'
        }),
    ],
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
    mode: 'production',
    devtool: 'source-map'
}