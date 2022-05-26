export const NOTIFICATIONS = {
  WALLET_CONNECT_SUCCESS: 'Successfully connected wallet.',
  WALLET_DISCONNECT_SUCCESS: 'Successfully disconnected wallet.',
  ERROR_CONNECTING_WALLET:
    'There was an error connecting to your wallet. Try again.',
  PLAID_CONNECTION_ERROR:
    'There was an error connecting to your Plaid account. Please try again.',
  PLAID_CONNECTION_SUCCESS: 'Successfully connected to account via Plaid.',
  PLAID_CLOSED:
    'The Plaid window was closed! Unable to connect to your account.',
};

export const USE_TESTNET_ON_PROD = false;

export const CHAIN_ID_LOCAL = 'enigma-pub-testnet-3';
export const REST_URL_LOCAL = 'http://localhost:1337/';
export const RPC_PORT_LOCAL = 'http://localhost:26657/';

export const IS_MAINNET =
  process.env.ENV === 'production' && !USE_TESTNET_ON_PROD;

export const CHAIN_ID = IS_MAINNET ? 'secret-4' : 'pulsar-2';

export const REST_URL = IS_MAINNET
  ? process.env.NEXT_PUBLIC_MAINNET_API_URL
  : 'https://api.pulsar.griptapejs.com';

export const RPC_PORT = 'https://rpc.pulsar.griptapejs.com/';

export const SECRET_CONTRACT_ADDR = IS_MAINNET
  ? 'secret1lgays77xvx5eqvv9k0083d62zr9nwhhtel7658'
  : 'secret1mj2l3pkz0ls8jkc2pkv2unudldufyzhnmzfx9p';

/*
FOR PULSAR: 
Binaries and executables: https://github.com/scrtlabs/SecretNetwork/releases/tag/v1.2.2 Use the testnet binary
Explorer: https://secretnodes.com/secret/chains/pulsar-2
Faucet: https://faucet.secrettestnet.io/
chain-id: pulsar-2
*/

export const CUSTOM_FEES = IS_MAINNET
  ? {}
  : {
      upload: {
        amount: [{ amount: '44386260', denom: 'uscrt' }],
        gas: '44386260',
      },
      init: {
        amount: [{ amount: '4438626', denom: 'uscrt' }],
        gas: '4438626',
      },
      exec: {
        amount: [{ amount: '4438626', denom: 'uscrt' }],
        gas: '4438626',
      },
    };

export const BORDER_GRADIENT_STYLE =
  'linear-gradient(180deg, rgba(85,42,170,1) 0%, rgba(7,144,192,1) 100%)';

export const BORDER_GREYSCALE =
  'linear-gradient(180deg, rgba(161,161,161,1) 0%, rgba(47,47,47,1) 100%, rgba(7,144,192,1) 100%)';
