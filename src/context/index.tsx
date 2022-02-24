import React, { useState, useContext, createContext, useEffect } from 'react';

import { notification } from 'antd';
import { ItemPublicTokenExchangeResponse } from 'plaid';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import { SigningCosmWasmClient } from 'secretjs';

import { NOTIFICATIONS } from '../constants';
import { ICoinbaseTokenCreateResponse } from '../pages/api/coinbase';
import { handleKeplrOpen } from '../utils';

interface ISecretContext {
  secretjs: SigningCosmWasmClient | null;
  secretAddress: string | null;
  setSecretAddress: React.Dispatch<React.SetStateAction<string | null>>;
  setSecretjs: React.Dispatch<
    React.SetStateAction<SigningCosmWasmClient | null>
  >;
  loading: boolean;
  disconnectWallet: () => void;
  connectWallet: () => void;
  connectRequest: boolean;
  setConnectRequest: React.Dispatch<React.SetStateAction<boolean>>;
  setCoinbaseToken: React.Dispatch<
    React.SetStateAction<ICoinbaseTokenCreateResponse | undefined>
  >;
  coinbaseToken: ICoinbaseTokenCreateResponse | undefined;
  setPlaidPublicToken: React.Dispatch<
    React.SetStateAction<undefined | PlaidToken>
  >;
  plaidPublicToken: PlaidToken | undefined;
  plaidPublicExchangeResponse: ItemPublicTokenExchangeResponse | undefined;
  setPlaidPublicExchangeResponse: React.Dispatch<
    React.SetStateAction<undefined | ItemPublicTokenExchangeResponse>
  >;
  plaidMetadata: any;
  setPlaidMetadata: any;
}

interface PlaidToken {
  publicToken: string;
}

const Context = createContext<ISecretContext | undefined>(undefined);

const useSecretContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useSecretContext must be used within a Context Provider');
  }
  return context;
};
const storageHelper = {
  persist: (key: string, item: any) =>
    localStorage.setItem(key, JSON.stringify(item)),
  get: (key: string) => {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  },
};

const ContextProvider = ({ children }: any) => {
  const [secretAddress, setSecretAddress] = useState<string | null>(null);
  const [secretjs, setSecretjs] = useState<SigningCosmWasmClient | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [connectRequest, setConnectRequest] = useState<boolean>(false);
  const [coinbaseToken, setCoinbaseToken] = useState<
    ICoinbaseTokenCreateResponse | undefined
  >(undefined);
  const [plaidPublicToken, setPlaidPublicToken] = useState<
    undefined | PlaidToken
  >(undefined);
  const [plaidMetadata, setPlaidMetadata] =
    useState<PlaidLinkOnSuccessMetadata | null>(null);
  const [plaidPublicExchangeResponse, setPlaidPublicExchangeResponse] =
    useState<undefined | ItemPublicTokenExchangeResponse>(undefined);

  const setClearLocalStorage = () => {
    !!secretjs && storageHelper.persist('secretjs', null);
    secretAddress && storageHelper.persist('secretAddress', null);
    coinbaseToken && storageHelper.persist('coinbaseToken', null);
    plaidPublicToken && storageHelper.persist('plaidPublicToken', null);
    plaidPublicExchangeResponse &&
      storageHelper.persist('plaidPublicExchangeResponse', null);
  };

  const disconnectWallet = () => {
    setSecretAddress(null);
    setSecretjs(null);
    setConnectRequest(false);
    setCoinbaseToken(undefined);
    setPlaidPublicToken(undefined);
    setPlaidPublicExchangeResponse(undefined);
    setClearLocalStorage();
    if (!secretjs) {
      notification.success({
        message: NOTIFICATIONS.WALLET_DISCONNECT_SUCCESS,
      });
    }
  };

  const connectWallet = () => {
    handleKeplrOpen(setSecretjs, setSecretAddress);
  };

  // PERSIST TO STORAGE HERE:
  useEffect(() => {
    secretjs && storageHelper.persist('secretjs', secretjs);
    secretAddress && storageHelper.persist('secretAddress', secretAddress);
    coinbaseToken && storageHelper.persist('coinbaseToken', coinbaseToken);
    plaidPublicToken &&
      storageHelper.persist('plaidPublicToken', plaidPublicToken);
    plaidPublicExchangeResponse &&
      storageHelper.persist(
        'plaidPublicExchangeResponse',
        plaidPublicExchangeResponse
      );

    setLoading(false);
  }, [
    secretjs,
    secretAddress,
    coinbaseToken,
    plaidPublicToken,
    plaidPublicExchangeResponse,
  ]);

  // HYDRATE CONTEXT HERE:
  useEffect(() => {
    setSecretjs(storageHelper.get('secretjs'));
    setSecretAddress(storageHelper.get('secretAddress'));
    setCoinbaseToken(storageHelper.get('coinbaseToken'));
    setPlaidMetadata(storageHelper.get('plaidMetadata'));
    setPlaidPublicToken(storageHelper.get('plaidPublicToken'));
    setPlaidPublicExchangeResponse(
      storageHelper.get('plaidPublicExchangeResponse')
    );

    setLoading(false);
  }, []);

  return (
    <Context.Provider
      value={{
        disconnectWallet,
        connectWallet,
        connectRequest,
        setConnectRequest,
        loading,
        secretAddress,
        setSecretAddress,
        secretjs,
        setSecretjs,
        setCoinbaseToken,
        coinbaseToken,
        setPlaidPublicToken,
        plaidPublicToken,
        plaidPublicExchangeResponse,
        setPlaidPublicExchangeResponse,
        plaidMetadata,
        setPlaidMetadata,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { ContextProvider, useSecretContext };
