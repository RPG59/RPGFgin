const path = require("path");

module.exports = {
  entry: "./sanbox/src/main.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(vert|frag|wgsl)$/i,
        use: [
          {
            loader: "raw-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "sanbox"),
  },
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "sanbox"),
    },
    compress: false,
    port: 6969,
  },
};
