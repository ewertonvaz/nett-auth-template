const glob = require('glob')
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: "production",
  target: "node",
  entry: 
    glob.sync('./dist/**/*.js').reduce((acc, path) => {
      const ignoreDirectory = [
        /types/
      ];
      if ( ignoreDirectory.some( value => { if ( path.search(value) === -1) return true; } )) {
        const entry = path.replace('.js', '').replace('dist/', '')
        console.log(entry)
        acc[entry] = path
      }
      return acc
    }, {}),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'prod'),
    clean: true
  },
  plugins: [
    // new BundleAnalyzerPlugin()
  ],
  resolve: {
    fallback: {
      "assert": false,
      "crypto": false,
      // "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
      "dns": false,
      "fs": false,
      "http": false,
      "https": false,
      "net": false,
      "path": false,
      "process": false,
      "querystring": false,
      "stream": false,
      "string_decoder": false,
      "timers": false,
      "tls": false,
      "util" : false,
      "url" : false,
      "zlib": false,
    },
    alias: {
      'pg-native': path.join(__dirname, 'src/aliases/pg-native.js'),
      'cardinal': path.join(__dirname, 'src/aliases/cardinal.js')
    },
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
    },
  },
  // https://webpack.js.org/configuration/other-options/#ignorewarnings
  ignoreWarnings: [
    (WebpackError, Compilation) => {
      const modulesToIgnore = [
        /mongodb/,
        /mssql/,
        /mysql/,
        /oracledb/,
        /pg-native/,
        /pg-query-stream/,
        /react-native-sqlite-storage/,
        /redis/,
        /sqlite3/,
        /sql.js/,
        /typeorm-aurora-data-api-driver/
      ]
      const errorMsg = WebpackError.message;
      return modulesToIgnore.some( value => { if ( errorMsg.search(value) !== -1) return true; } );
    }
  ]
};