import { Window as KeplrWindow } from '@keplr-wallet/types';
import { notification } from 'antd';
import { SigningCosmWasmClient } from 'secretjs';

import {
  CHAIN_ID,
  CUSTOM_FEES,
  REST_URL,
  RPC_PORT,
  SECRET_CONTRACT_ADDR,
} from '@scrtsybil/src/constants';

const EXPERIMENTAL: boolean = true;
const chainId = CHAIN_ID;
const rpc = RPC_PORT;
const rest = REST_URL;
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export const handleKeplrOpen = async (
  setSecretAddress: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (EXPERIMENTAL) {
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
        chainId,
        chainName: 'pulsar-2-test',
        rpc,
        rest,
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
      await window.keplr?.enable(chainId);
      // @ts-ignore
      const keplrOfflineSigner = window.getOfflineSigner(chainId);
      const accounts = await keplrOfflineSigner.getAccounts();

      // @ts-ignore
      const secretAddress = accounts[0].address;
      const cosmJS = new SigningCosmWasmClient(
        rest,
        secretAddress,
        keplrOfflineSigner as any,
        // @ts-ignore
        window.getEnigmaUtils(chainId),
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
      // cosmJS && setSecretjs(cosmJS);
    } catch {
      // eslint-disable-next-line no-alert
      alert('Failed to suggest the chain');
    }
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
      REST_URL,
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
