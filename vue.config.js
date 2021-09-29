module.exports = {
    devServer: {
        open: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3000',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/emoji': {
                target: 'https://i0.hdslb.com/bfs/emote',
                // 允许跨域
                changeOrigin: true,
                pathRewrite: {
                    '^/emoji': ''
                }
            }
        }
    }
}