import webpack from 'webpack';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import convict from 'convict';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV == 'production';

const configs = convict({
    env: {
        default: 'development',
        env: 'NODE_ENV'
    },
    api: {
        https: {
            default: false
        },
        host: {
            default: 'localhost'
        },
        port: {
            default: 3000
        }   
    }
});

const env = configs.get('env');
configs.loadFile(`./configs.${env}.json`);
configs.validate({ allowed: 'strict' });

const webpackConfigs = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...']
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'USE_HTTPS': JSON.stringify(configs.get('api.https')),
            'API_HOST': JSON.stringify(configs.get('api.host')),
            'API_PORT': JSON.stringify(configs.get('api.port'))
        })
    ],
    devServer: {
        hot: true,
        host: 'localhost',
        historyApiFallback: true
    }
}

if (isProduction) {
    webpackConfigs.mode = 'production';
} else {
    webpackConfigs.mode = 'development';
}

export default webpackConfigs;
