const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    entry: {
        main: path.join(__dirname, "src/index.js"), // prend en entrée index.js et dependances pour creer le bundle 'main'
        form: path.join(__dirname, "src/form/form.js"), // prend en entrée form.js et dependances pour creer le bundle 'form'
        topbar: path.join(__dirname, "assets/javascript/top-bar.js"),
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules)/,
                use: ["babel-loader"]
            },

            {
                test: /\.scss$/i,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new cleanWebpackPlugin.CleanWebpackPlugin(),
        new copyWebpackPlugin({ // le copy-webpack-plugin va copier des élement dans le dist (images par exemple)
            patterns: [
                {
                    from: "./assets/images/*", // d'ou on copie le webpack plugin
                    to: "", // la ou on le met
                    // flatten: true // pour que le chemin soit le 'to' et non le 'to' + 'from'
                }
            ]
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html', // nom du fichier dans le dist
            template: path.join(__dirname, "./src/index.html"), // chemin du template (fichier html)
            chunks: ["main", "topbar"] // liste des scripts inserer dans les fichiers html
        }),
        new HtmlWebpackPlugin({
            filename: 'form.html',
            template: path.join(__dirname, "./src/form/form.html"),
            chunks: ["form", "topbar"]
        })
    ],
    stats: "minimal",
    devtool: "source-map",
    mode: "development",
    devServer: {
        open: true,
        static: path.resolve(__dirname, './dist'),
        watchFiles: ['./src/**'],
        port: 4000,
        hot: true,
    }
};