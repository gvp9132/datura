const path = require('path');
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { on } = require('events');

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
                        use: {
                            loader: 'babel-loader',
                        },
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
        new CssMinimizerPlugin()
    ],
    // 生产模式不需要devServer
    // devServer: {
    //     // 服务器压缩
    //     compress: true,
    //     host: 'localhost',
    //     // 服务器端口
    //     port: 3001,
    //     // 自动打开浏览器
    //     open: true
    // } ,
    mode: 'production',
    devtool: 'source-map'
}