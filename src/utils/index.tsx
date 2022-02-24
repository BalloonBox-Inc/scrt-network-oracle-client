import { Window as KeplrWindow } from '@keplr-wallet/types';
import { SigningCosmWasmClient } from 'secretjs';

import { CHAIN_ID, REST_URL, RPC_PORT } from '@scrtsybil/src/constants';

const EXPERIMENTAL: boolean = true;
const chainId = CHAIN_ID;
const rpc = RPC_PORT;
const rest = REST_URL;
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export const handleKeplrOpen = async (
  setSecretjs: React.Dispatch<
    React.SetStateAction<SigningCosmWasmClient | null>
  >,
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

      const account = await cosmJS.getAccount(secretAddress);

      setSecretAddress(secretAddress);
      cosmJS && setSecretjs(cosmJS);
    } catch {
      // eslint-disable-next-line no-alert
      alert('Failed to suggest the chain');
    }
  }

  // try {
  //   // Enabling before using the Keplr is recommended.
  //   // This method will ask the user whether to allow access if they haven't visited this website.
  //   // Also, it will request that the user unlock the wallet if the wallet is locked.
  //   await window.keplr?.enable(chainId);

  //   const offlineSigner = window.keplr?.getOfflineSigner(chainId);
  //   const enigmaUtils = (window as any).getEnigmaUtils(chainId);

  //   console.log({ offlineSigner, enigmaUtils });

  //   // You can get the address/public keys by `getAccounts` method.
  //   // It can return the array of address/public key.
  //   // But, currently, Keplr extension manages only one address/public key pair. (this may have changed)
  //   // XXX: This line is needed to set the sender address for SigningCosmosClient.
  //   const accounts = await offlineSigner?.getAccounts();

  //   if (accounts?.length && accounts[0] && !!offlineSigner) {
  //     const secretAddress = accounts[0].address;

  //     const cosmJS = new SigningCosmWasmClient(
  //       // 'https://lcd-secret.keplr.app/rest',
  //       'http://bootstrap.supernova.enigma.co:1317',
  //       secretAddress,
  //       offlineSigner as any,
  //       enigmaUtils,
  //       undefined,
  //       BroadcastMode.Sync
  //     );
  //     setSecretAddress(secretAddress);
  //     console.log({ cosmJS });
  //     cosmJS && setSecretjs(cosmJS);
  //   }
  // } catch (error) {
  //   notification.error({
  //     message: NOTIFICATIONS.ERROR_CONNECTING_WALLET,
  //   });
  //   setConnectRequest(false);
  // }
};
