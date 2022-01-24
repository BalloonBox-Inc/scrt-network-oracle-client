import { Window as KeplrWindow } from '@keplr-wallet/types';
import { notification } from 'antd';
import { SigningCosmWasmClient, BroadcastMode } from 'secretjs';

import { NOTIFICATIONS } from '@scrtsybil/src/constants';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export const handleKeplrOpen = async (
  setSecretjs: React.Dispatch<
    React.SetStateAction<SigningCosmWasmClient | null>
  >,
  setSecretAddress: React.Dispatch<React.SetStateAction<string | null>>,
  setConnectRequest: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const chainId = 'cosmoshub-4';

  try {
    // Enabling before using the Keplr is recommended.
    // This method will ask the user whether to allow access if they haven't visited this website.
    // Also, it will request that the user unlock the wallet if the wallet is locked.
    await window.keplr?.enable(chainId);

    const offlineSigner = window.keplr?.getOfflineSigner(chainId);
    const enigmaUtils = (window as any).getEnigmaUtils(chainId);

    // You can get the address/public keys by `getAccounts` method.
    // It can return the array of address/public key.
    // But, currently, Keplr extension manages only one address/public key pair. (this may have changed)
    // XXX: This line is needed to set the sender address for SigningCosmosClient.
    const accounts = await offlineSigner?.getAccounts();

    if (accounts?.length && accounts[0] && !!offlineSigner) {
      const secretAddress = accounts[0].address;

      const cosmJS = new SigningCosmWasmClient(
        'https://lcd-secret.keplr.app/rest',
        secretAddress,
        offlineSigner as any,
        enigmaUtils,
        undefined,
        BroadcastMode.Sync
      );
      setSecretAddress(secretAddress);
      cosmJS && setSecretjs(cosmJS);
    }
  } catch (error) {
    notification.error({
      message: NOTIFICATIONS.ERROR_CONNECTING_WALLET,
    });
    setConnectRequest(false);
  }
};
