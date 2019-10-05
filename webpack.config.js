/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    devtool: 'inline-source-map',
    entry: {
        popup: './src/popup.tsx',
        background: './src/background.ts',
    },
    context: path.join(__dirname),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
        ],
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    plugins: [
        new CopyPlugin([
            { from: 'src/popup.html', to: 'popup.html' },
            { from: 'src/manifest.json', to: 'manifest.json' },
            { from: 'src/icons', to: 'icons' },
        ]),
    ],
};
