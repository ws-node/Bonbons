const webpack = require("webpack");

const path = require("path");

module.exports = {
    target: 'node',
    entry: {
        index: path.resolve(__dirname, "src/app/index.ts"),
        vendor: ["express", "uuid", "reflect-metadata", "body-parser"]
    },
    output: {
        path: path.resolve(__dirname, "server"),
        filename: "[name].bundle.js"
    },
    mode: "development",
    devtool: 'inline-source-map',
    resolve: {
        modules: ["node_modules"],
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["ts-loader"]
            }
        ]
    }
};
