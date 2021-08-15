module.exports = {
  // ...
  env: {
    PRIVATE_NOMIC_KEY: process.env.NOMIC_API_KEY,
    PRIVATE_CURRENCYSCOOP_API_KEY: process.env.CURRENCYSCOOP_API_KEY,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      // ...
    ],
  },
};
