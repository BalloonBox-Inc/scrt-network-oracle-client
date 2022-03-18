import React, { useState, useContext, createContext, useEffect } from 'react';

import { notification } from 'antd';
import { ItemPublicTokenExchangeResponse } from 'plaid';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import { SigningCosmWasmClient } from 'secretjs';
import { StdSignature } from 'secretjs/types/types';

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
  scoreResponse: any;
  setScoreResponse: any;
  chainActivity: null | IChainActivity;
  setChainActivity: React.Dispatch<React.SetStateAction<IChainActivity | null>>;
  permissionSig?: StdSignature;
  setPermissionSig: React.Dispatch<
    React.SetStateAction<StdSignature | undefined>
  >;
}

interface IChainActivity {
  scoreSubmitted?: boolean;
  queryPermit?: string[];
  permissionKey?: string[];
  shareableLink?: boolean;
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
export const storageHelper = {
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
  const [scoreResponse, setScoreResponse] = useState<any>(undefined);
  const [coinbaseToken, setCoinbaseToken] = useState<
    ICoinbaseTokenCreateResponse | undefined
  >(undefined);
  const [plaidPublicToken, setPlaidPublicToken] = useState<
    undefined | PlaidToken
  >(undefined);
  const [chainActivity, setChainActivity] = useState<IChainActivity | null>(
    null
  );
  const [plaidPublicExchangeResponse, setPlaidPublicExchangeResponse] =
    useState<undefined | ItemPublicTokenExchangeResponse>(undefined);

  const [permissionSig, setPermissionSig] = useState<StdSignature | undefined>(
    undefined
  );

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

  useEffect(() => {
    secretAddress && setConnectRequest(false);
  }, [secretAddress]);

  const connectWallet = () => {
    handleKeplrOpen(setSecretjs, setSecretAddress);
  };

  // PERSIST TO STORAGE HERE:
  useEffect(() => {
    secretjs && storageHelper.persist('secretjs', secretjs);
    secretAddress && storageHelper.persist('secretAddress', secretAddress);
    scoreResponse && storageHelper.persist('scoreResponse', scoreResponse);
    coinbaseToken && storageHelper.persist('coinbaseToken', coinbaseToken);
    plaidPublicToken &&
      storageHelper.persist('plaidPublicToken', plaidPublicToken);
    plaidPublicExchangeResponse &&
      storageHelper.persist(
        'plaidPublicExchangeResponse',
        plaidPublicExchangeResponse
      );
    chainActivity && storageHelper.persist('chainActivity', chainActivity);

    setLoading(false);
  }, [
    secretjs,
    secretAddress,
    coinbaseToken,
    plaidPublicToken,
    plaidPublicExchangeResponse,
    scoreResponse,
    chainActivity,
  ]);

  // HYDRATE CONTEXT HERE:
  useEffect(() => {
    setSecretjs(storageHelper.get('secretjs'));
    setSecretAddress(storageHelper.get('secretAddress'));
    setCoinbaseToken(storageHelper.get('coinbaseToken'));
    setPlaidPublicToken(storageHelper.get('plaidPublicToken'));
    setPlaidPublicExchangeResponse(
      storageHelper.get('plaidPublicExchangeResponse')
    );
    setScoreResponse(storageHelper.get('scoreResponse'));
    setChainActivity(storageHelper.get('chainActivity'));

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
        scoreResponse,
        setScoreResponse,
        chainActivity,
        setChainActivity,
        permissionSig,
        setPermissionSig,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { ContextProvider, useSecretContext };
