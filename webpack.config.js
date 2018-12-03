var webpack = require('webpack');

/*
 * Default webpack configuration for development
 */
var config = {
    devtool: 'eval-source-map',
    entry:  {
        /*login:__dirname + "/app/app-login.js",
       register:__dirname + "/app/app-register.js",
        reset:__dirname + "/app/app-reset.js",
        index:__dirname + "/app/app-index.js",
        light:__dirname + "/app/app-light.js",
       screen:__dirname + "/app/app-screen.js",
       data:__dirname + "/app/app-data.js",
       intrusion:__dirname + "/app/app-intrusion.js",
       status:__dirname + "/app/app-status.js",
        statistics:__dirname + "/app/app-statistics.js",*/
        system:__dirname + "/app/app-system.js",
    },
    output: {
        path: __dirname + "/bundle",
        filename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015','react','stage-0'],
                plugins: [                                             //
                    ["import", {libraryName: "antd", style: "css"}]   //需要配置的地方,按需加载组件
                ]                                                    //
            }
        },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
    devServer: {
        contentBase: "./public",
        colors: true,
        historyApiFallback: true,
        inline: true
    },
    externals:{
        'BMap':'BMap'
    },
}

/*
 * If bundling for production, optimize output
 */
if (process.env.NODE_ENV === 'production') {
    config.devtool = false;
    config.plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({comments: false}),
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify('production')}
        })
    ];
};

module.exports = config;