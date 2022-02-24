export const NOTIFICATIONS = {
  WALLET_CONNECT_SUCCESS: 'Successfully connected wallet.',
  WALLET_DISCONNECT_SUCCESS: 'Successfully disconnected wallet.',
  ERROR_CONNECTING_WALLET:
    'There was an error connecting to your wallet. Try again.',
  PLAID_CONNECTION_ERROR:
    'There was an error connecting to your Plaid account. Please try again.',
  PLAID_CONNECTION_SUCCESS: 'Successfully connected to account via Plaid.',
};

// const CHAIN_ID = 'holodeck-2'; //THIS NO LONGER WORKS!
// const CHAIN_ID = 'cosmoshub-4';
// const rest = 'https://chainofsecrets.secrettestnet.io'; // Does this work?
// const rpc = 'http://chainofsecrets.secrettestnet.io:26657'; // does this owrk?

export const CHAIN_ID = 'pulsar-2';
export const CHAIN_ID_LOCAL = 'enigma-pub-testnet-3';
export const REST_URL = 'http://testnet.securesecrets.org:1317/';
export const REST_URL_LOCAL = 'http://localhost:1337/';
export const RPC_PORT = 'https://rpc.pulsar.griptapejs.com/';
export const RPC_PORT_LOCAL = 'http://localhost:26657/';

export const REST_URL_FIGMENT = 'http://bootstrap.supernova.enigma.co:1317';
export const CHAIN_ID_FIGMENT = 'secret';

export const SECRET_CONTRACT_ADDR =
  'secret10umfyhsecem4yz4y0gz5vs5nvlkn3za22nxr6j';
/*
FOR PULSAR: 
Binaries and executables: https://github.com/scrtlabs/SecretNetwork/releases/tag/v1.2.2 Use the testnet binary

Explorer: https://secretnodes.com/secret/chains/pulsar-2

Faucet: https://faucet.secrettestnet.io/

chain-id: pulsar-2

*/

export const CUSTOM_FEES = {
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
