/**
 * @file Webpack configuration file.
 */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
// in case you run into any typescript error when configuring `devServer`
require("webpack-dev-server");
const { EsbuildPlugin } = require("esbuild-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlReplaceWebpackPlugin = require("html-replace-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env, argv) => {
    const mode = argv.mode;
    /**
     * @type {import("webpack").Configuration}
     */
    const options = {
        entry: "./src/index.tsx", // Entry point of your application
        output: {
            path: path.resolve(__dirname, "build"),
            filename: "bundle.js", // Output bundle file name
        },
        resolve: {
            extensions: [".css", ".tsx", ".ts", ".js", "..."],
            alias: {
                "emath.js": "emath.js/ts",
                "emath.js/game": "emath.js/ts/game",
                "emath.js/presets": "emath.js/ts/presets",
            },
        },
        module: {
            rules: [
            // Use esbuild to compile JavaScript & TypeScript
                {
                // Match `.js`, `.jsx`, `.ts` or `.tsx` files
                    test: /\.[jt]sx?$/,
                    exclude: /node_modules/,
                    loader: "esbuild-loader",
                    options: {
                    // JavaScript version to compile to
                        target: "es2015",
                        tsconfig: "./tsconfig.json",
                    },
                },
                {
                    // If you enable `experiments.css` or `experiments.futureDefaults`, please uncomment line below
                    // type: "javascript/auto",
                    test: /\.(sa|sc|c)ss$/i,
                    use: [
                        mode === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
                        "css-loader",
                    ],
                },
            ],
        },
        optimization: {
            minimizer: [
                new EsbuildPlugin({
                    target: "es2015", // Syntax to transpile to
                }),
                new CssMinimizerPlugin(),
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html", // Use this HTML file as a template
            }),
            // Define global constants
            new EsbuildPlugin({
                define: {
                    MODE: JSON.stringify(mode),
                },
            }),
            new HtmlReplaceWebpackPlugin([
                {
                    pattern: "%PUBLIC_URL%",
                    // ! This is the public path of your app
                    replacement: mode === "production" ? "./public/" : "./",
                },
            ]),
        ],
    };
    if (mode === "production") {
        options.plugins.push(
            // Copies public folder to dist folder
            new CopyPlugin({
                patterns: [
                    {
                        from: "public",
                        to: "public",
                        globOptions: {
                            ignore: ["**/index.html"],
                        },
                    },
                ],
            }),
            new MiniCssExtractPlugin(),
        );
    } else if (mode === "development") {
        options.devtool = "eval-cheap-module-source-map";
    }
    return options;
};
