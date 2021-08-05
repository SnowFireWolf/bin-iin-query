module.exports = {
    publicPath: '/',
    productionSourceMap: false,

    css: {
        // 是否使用css分離外掛 ExtractTextPlugin
        extract: false,
        // 開啟 CSS source maps?
        sourceMap: false,
        // 啟用 CSS modules for all css / pre-processor files.
        requireModuleExtension: true,
        // css預設器配置項
        loaderOptions: {
            css: {
                modules: {
                    mode: "global",
                    localIdentName: '[hash:6]'
                }
            }
        },
    },

    configureWebpack: {
        plugins: [
        ]
    }
}
