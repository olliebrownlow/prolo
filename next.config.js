module.exports = {
  // ...
  env: {
    PRIVATE_NOMIC_KEY: process.env.NOMIC_API_KEY,
    PRIVATE_CURRENCYSCOOP_API_KEY: process.env.CURRENCYSCOOP_API_KEY,
  },
  images: {
    domains: ['s3.us-east-2.amazonaws.com'],
  },
};
