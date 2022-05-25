import { Window as KeplrWindow } from '@keplr-wallet/types';
import { notification } from 'antd';
import { SigningCosmWasmClient } from 'secretjs';

import {
  CHAIN_ID,
  CUSTOM_FEES,
  IS_MAINNET,
  REST_URL,
  RPC_PORT,
  SECRET_CONTRACT_ADDR,
} from '@scrtsybil/src/constants';

import { Set_Secret_Address, Set_Connect_Request } from '../context';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

const handleKeplrOpenMainNet = async (
  setSecretAddress: Set_Secret_Address,
  setConnectRequest: Set_Connect_Request
) => {
  try {
    // ADDING THIS as we see it in in https://github.com/scrtlabs/SecretJS-Templates/blob/master/6_wallets/keplr/src/main.js
    await window.keplr?.enable('secret-4');
    // @ts-ignore
    const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
    const accounts = await keplrOfflineSigner.getAccounts();

    // @ts-ignore
    const secretAddress = accounts[0].address;
    const cosmJS = new SigningCosmWasmClient(
      REST_URL as string,
      secretAddress,
      keplrOfflineSigner as any,
      // @ts-ignore
      window.getEnigmaUtils(CHAIN_ID)
    );

    await cosmJS.getAccount(secretAddress);

    setSecretAddress(secretAddress);
  } catch (error) {
    if (!window.keplr) {
      notification.error({ message: 'Please install keplr extension' });
    } else {
      notification.error({
        message:
          'There was an error connecting to the network. Try again later.',
      });
    }
    setConnectRequest(false);
  }
};

export const handleKeplrOpenTestNet = async (
  setSecretAddress: Set_Secret_Address,
  setConnectRequest: Set_Connect_Request
  // eslint-disable-next-line consistent-return
) => {
  try {
    // for testing, use a custom chain with Keplr.
    // On mainnet we don't need this (`experimentalSuggestChain`).
    // This works well with `enigmampc/secret-network-sw-dev`:
    //     - https://hub.docker.com/r/enigmampc/secret-network-sw-dev
    //     - Run a local chain: `docker run -it --rm -p 26657:26657 -p 26656:26656 -p 1337:1337 -v $(shell pwd):/root/code --name secretdev enigmampc/secret-network-sw-dev`
    //     - `alias secretcli='docker exec -it secretdev secretcli'`
    //     - Store a contract: `docker exec -it secretdev secretcli tx compute store /root/code/contract.wasm.gz --from a --gas 10000000 -b block -y`
    // On holodeck, set:
    //     1. CHAIN_ID = "holodeck-2"
    //     2. rpc = "ttp://chainofsecrets.secrettestnet.io:26657" || if local: 'http://localhost:26657'
    //     3. rest = "https://chainofsecrets.secrettestnet.io" || if local: 'http://localhost:1337'
    //     4. chainName = Whatever you like
    // For more examples, go to: https://github.com/chainapsis/keplr-example/blob/master/src/main.js
    await window.keplr?.experimentalSuggestChain({
      chainId: CHAIN_ID,
      chainName: 'pulsar-2',
      rpc: RPC_PORT,
      rest: REST_URL as string,
      bip44: {
        coinType: 529,
      },
      coinType: 529,
      stakeCurrency: {
        coinDenom: 'SCRT',
        coinMinimalDenom: 'uscrt',
        coinDecimals: 6,
      },
      bech32Config: {
        bech32PrefixAccAddr: 'secret',
        bech32PrefixAccPub: 'secretpub',
        bech32PrefixValAddr: 'secretvaloper',
        bech32PrefixValPub: 'secretvaloperpub',
        bech32PrefixConsAddr: 'secretvalcons',
        bech32PrefixConsPub: 'secretvalconspub',
      },
      currencies: [
        {
          coinDenom: 'SCRT',
          coinMinimalDenom: 'uscrt',
          coinDecimals: 6,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: 'SCRT',
          coinMinimalDenom: 'uscrt',
          coinDecimals: 6,
        },
      ],
      gasPriceStep: {
        low: 0.1,
        average: 0.25,
        high: 0.4,
      },
      features: ['secretwasm'],
    });

    // ADDING THIS as we see it in in https://github.com/scrtlabs/SecretJS-Templates/blob/master/6_wallets/keplr/src/main.js
    await window.keplr?.enable(CHAIN_ID);
    // @ts-ignore
    const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
    const accounts = await keplrOfflineSigner.getAccounts();

    // @ts-ignore
    const secretAddress = accounts[0].address;
    const cosmJS = new SigningCosmWasmClient(
      REST_URL as string,
      secretAddress,
      keplrOfflineSigner as any,
      // @ts-ignore
      window.getEnigmaUtils(CHAIN_ID),
      {
        init: {
          amount: [{ amount: '300000', denom: 'uscrt' }],
          gas: '300000',
        },
        exec: {
          amount: [{ amount: '300000', denom: 'uscrt' }],
          gas: '300000',
        },
      }
    );

    await cosmJS.getAccount(secretAddress);

    setSecretAddress(secretAddress);
  } catch (error) {
    if (!window.keplr) {
      notification.error({ message: 'Please install keplr extension' });
    } else {
      notification.error({
        message:
          'There was an error connecting to the network. Try again later.',
      });
    }
    setConnectRequest(false);
  }
};

export const queryAsServProvider = async ({
  permissionName,
  permissionSignature,
  publicAddress,
}: {
  permissionName: string;
  permissionSignature: string;
  publicAddress: string;
}) => {
  try {
    // @ts-ignore
    const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
    const accounts = await keplrOfflineSigner.getAccounts();
    // @ts-ignore
    const addr = accounts[0].address;

    const cosmJS = new SigningCosmWasmClient(
      REST_URL as string,
      addr,
      keplrOfflineSigner as any,
      // @ts-ignore
      window.getEnigmaUtils(CHAIN_ID),
      CUSTOM_FEES
      // BroadcastMode.Sync
    );

    const getScoreWithPermission = {
      with_permit: {
        query: { balance: {} },
        permit: {
          params: {
            permit_name: permissionName,
            allowed_tokens: [SECRET_CONTRACT_ADDR],
            chain_id: CHAIN_ID,
            permissions: ['balance'],
          },
          signature: {
            pub_key: {
              type: 'tendermint/PubKeySecp256k1',
              value: publicAddress,
            },
            signature: permissionSignature,
          },
        },
      },
    };
    const response = await cosmJS.queryContractSmart(
      SECRET_CONTRACT_ADDR,
      getScoreWithPermission
    );
    if (response.Ok) {
      notification.success({
        message: `Score queried: ${response.Ok.score}`,
      });
    }
  } catch (error) {
    notification.error({
      message: 'There was an error',
    });
  }
};

export function handleKeplrOpen(
  setSecretAddress: Set_Secret_Address,
  setConnectRequest: Set_Connect_Request
) {
  IS_MAINNET
    ? handleKeplrOpenMainNet(setSecretAddress, setConnectRequest)
    : handleKeplrOpenTestNet(setSecretAddress, setConnectRequest);
}
