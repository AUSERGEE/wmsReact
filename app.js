// 引入模块
const express = require('express');
const webpackDevMiddleware = require("webpack-dev-middleware");
const WebpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require("webpack");
const proxy = require('http-proxy-middleware');
const app = express();
const config = require('./webpack.config');
config.entry.app.unshift("webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000");
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    hot: true,
    inline: true,
    noInfo: false,
    stats: {
        colors: true,
    }
}));
app.use(WebpackHotMiddleware(compiler));


const server = app.listen(3004, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});