import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useCallback,
} from 'react';

import { notification } from 'antd';
import router from 'next/router';
import { ItemPublicTokenExchangeResponse } from 'plaid';
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
  scoreResponsePlaid: any;
  setScoreResponsePlaid: any;
  scoreResponseCoinbase: any;
  setScoreResponseCoinbase: any;
  chainActivity: null | IChainActivity;
  setChainActivity: React.Dispatch<React.SetStateAction<IChainActivity | null>>;
  permissionSig?: StdSignature;
  setPermissionSig: React.Dispatch<
    React.SetStateAction<StdSignature | undefined>
  >;
}

export interface IChainActivity {
  scoreSubmitted?: boolean;
  queryPermit?: string[];
  permissionKey?: string[];
  shareableLink?: boolean;
  dataProvider?: 'coinbase' | 'plaid';
  scoreAmount?: number;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [connectRequest, setConnectRequest] = useState<boolean>(false);
  const [scoreResponsePlaid, setScoreResponsePlaid] = useState<any>(undefined);
  const [scoreResponseCoinbase, setScoreResponseCoinbase] =
    useState<any>(undefined);
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

  const returnHome = useCallback(() => {
    (router.pathname.includes('applicant') ||
      router.pathname.includes('provider')) &&
      router.push('/');
  }, []);

  useEffect(() => {
    // use this to rerouter user to home page if router includes 'applicant' or 'provider'
    if (!loading) {
      !secretAddress && returnHome();
    }
  }, [returnHome, secretAddress, loading]);

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
    scoreResponsePlaid &&
      storageHelper.persist('scoreResponsePlaid', scoreResponsePlaid);
    scoreResponseCoinbase &&
      storageHelper.persist('scoreResponseCoinbase', scoreResponseCoinbase);
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
    scoreResponsePlaid,
    chainActivity,
    scoreResponseCoinbase,
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
    setScoreResponsePlaid(storageHelper.get('scoreResponsePlaid'));
    setScoreResponsePlaid(storageHelper.get('scoreResponseCoinbase'));
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
        scoreResponsePlaid,
        setScoreResponsePlaid,
        chainActivity,
        setChainActivity,
        permissionSig,
        setPermissionSig,
        scoreResponseCoinbase,
        setScoreResponseCoinbase,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { ContextProvider, useSecretContext };
