/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  env: {
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_URL_SANDBOX: process.env.PLAID_URL_SANDBOX,
    PLAID_SECRET_KEY_SANDBOX: process.env.PLAID_SECRET_KEY_SANDBOX,
    COINBASE_CLIENT_ID: process.env.COINBASE_CLIENT_ID,
    COINBASE_CLIENT_SECRET: process.env.COINBASE_CLIENT_SECRET,
    COINBASE_BASE_AUTHORIZE_URL: process.env.COINBASE_BASE_AUTHORIZE_URL,
    COINBASE_ACCESS_TOKEN_URL: process.env.COINBASE_ACCESS_TOKEN_URL,
    IN_PROGRESS: process.env.IN_PROGRESS,
    NEXT_BASE_URL: process.env.NEXT_BASE_URL,
  },
};
