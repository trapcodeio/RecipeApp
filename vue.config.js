const target = 'http://localhost:3002';
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target,
                ws: false,
                changeOrigin: true
            },
            '/storage': {
                target,
                ws: false,
                changeOrigin: true
            },
        }
    }
}