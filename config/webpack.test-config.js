const path = require('path');
const os = require('os');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// 获取cpu核心数量
const threads = os.cpus().length - 2;
module.exports = {
    entry: {
        // 配置多个入口文件
        app: "./src/app.js",
        mian: "./src/main.js"
    },
    output: {
        // 配置多个出口文件
        filename: "static/js/[name].js",
        path: path.resolve(__dirname, '../dist'),
        clean: true
    },
    module: {
        rules: [
            {
                oneOf: [
                    // 配置cssloader
                    {
                        test: /\.css$/,
                        use: [MiniCssExtractPlugin.loader, 'css-loader']
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
                                    cacheCompression: false,
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
        ],
        // 配置代码分割
        splitChunks: {
            // 对所有模块进行分割
            chunks: 'all',
            // 代码至少被引用一次才会被分割
            minChunks: 1,
            cacheGroups: {
                default: {
                    // 定义文件需要被分割的大小,实际开发的时候使用默认值
                    minSize: 0,
                    // 代码用到两次才会被分割
                    minChunks: 2,
                    // 权重
                    priority: -20,
                    // 重用已有的模块
                    reuseExistingChunk: true,
                },
            }
        }  
    },
    mode: 'production',
    devtool: 'source-map'
}