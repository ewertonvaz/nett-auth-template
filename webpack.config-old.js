const path = require('path');

module.exports = {
  mode: "production",
  target: "node",
  externals: {
    typeorm: 'commonjs typeorm'
  },
  entry: {
    index: './src/index.ts',
    // repo_mysql: './dist/repositories/user.mysql.repository.js',
    // repo_postgres: './dist/repositories/user.postgres.repository.js',
    // orm: [ './dist/shared/orm/appdata.connect.js', './dist/shared/orm/auth.connect.js' ]
  },
  output: {
    filename: 'index.js',
    //filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'prod'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
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
//   performance: {
//     hints: false,
//     maxEntrypointSize: 512000,
//     maxAssetSize: 512000
//   },
//   optimization: {
//     splitChunks: {
//       chunks: 'all',
//       cacheGroups: {
//         defaultVendors: {
//           filename: '[name].bundle.js',
//         },
//       },
//     }
//   },

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