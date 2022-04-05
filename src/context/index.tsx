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
import { StdSignature } from 'secretjs/types/types';

import { NOTIFICATIONS } from '../constants';
import { ICoinbaseTokenCreateResponse } from '../pages/api/coinbase';
import { IScoreResponseCoinbase, IScoreResponsePlaid } from '../types/types';

interface ISecretContext {
  secretAddress: string | null;
  setSecretAddress: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  disconnectWallet: () => void;
  connectRequest: boolean;
  setConnectRequest: React.Dispatch<React.SetStateAction<boolean>>;
  setCoinbaseToken: React.Dispatch<
    React.SetStateAction<ICoinbaseTokenCreateResponse | null>
  >;
  coinbaseToken: ICoinbaseTokenCreateResponse | null;
  setPlaidPublicToken: React.Dispatch<React.SetStateAction<null | PlaidToken>>;
  plaidPublicToken: PlaidToken | null;

  setScoreResponse: React.Dispatch<
    React.SetStateAction<IScoreResponseCoinbase | IScoreResponsePlaid | null>
  >;
  scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null;
  chainActivity: IChainActivity;
  setChainActivity: React.Dispatch<React.SetStateAction<IChainActivity>>;
  permissionSig: { name: string; signature: StdSignature } | null;
  setPermissionSig: React.Dispatch<
    React.SetStateAction<{ name: string; signature: StdSignature } | null>
  >;
  handleSetChainActivity: any;
}

export enum CHAIN_ACTIVITIES {
  scoreSubmitted = 'scoreSubmitted',
  shareableLink = 'shareableLink',
  dataProvider = 'dataProvider',
  scoreAmount = 'scoreAmount',
  viewingKey = 'viewingKey',
}
export interface IChainActivity {
  [CHAIN_ACTIVITIES.scoreSubmitted]?: boolean;
  [CHAIN_ACTIVITIES.shareableLink]?: boolean;
  [CHAIN_ACTIVITIES.dataProvider]?: 'coinbase' | 'plaid';
  [CHAIN_ACTIVITIES.scoreAmount]?: number;
  [CHAIN_ACTIVITIES.viewingKey]?: string;
}

const CHAIN_ACTIVITY_INIT = {
  scoreSubmitted: undefined,
  shareableLink: undefined,
  dataProvider: undefined,
  scoreAmount: undefined,
  viewingKey: undefined,
};

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
  const [loading, setLoading] = useState<boolean>(true);
  const [connectRequest, setConnectRequest] = useState<boolean>(false);
  const [scoreResponse, setScoreResponse] = useState<
    IScoreResponseCoinbase | IScoreResponsePlaid | null
  >(null);
  const [coinbaseToken, setCoinbaseToken] =
    useState<ICoinbaseTokenCreateResponse | null>(null);
  const [plaidPublicToken, setPlaidPublicToken] = useState<null | PlaidToken>(
    null
  );
  const [chainActivity, setChainActivity] =
    useState<IChainActivity>(CHAIN_ACTIVITY_INIT);
  const [plaidPublicExchangeResponse, setPlaidPublicExchangeResponse] =
    useState<null | ItemPublicTokenExchangeResponse>(null);
  const [permissionSig, setPermissionSig] = useState<{
    name: string;
    signature: StdSignature;
  } | null>(null);

  const disconnectWallet = () => {
    setSecretAddress(null);
    setConnectRequest(false);
    setCoinbaseToken(null);
    setPlaidPublicToken(null);
    setPlaidPublicExchangeResponse(null);
    localStorage.clear();
    notification.success({
      message: NOTIFICATIONS.WALLET_DISCONNECT_SUCCESS,
    });
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

  const handleSetChainActivity = (val: any) => {
    if (val) {
      setChainActivity({
        ...chainActivity,
        ...val,
      });
      storageHelper.persist('chainActivity', val);
    } else {
      setChainActivity(CHAIN_ACTIVITY_INIT);
      storageHelper.persist('chainActivity', CHAIN_ACTIVITY_INIT);
    }
  };

  // PERSIST TO STORAGE HERE (after loading from storage, we update local when state changes)
  useEffect(() => {
    if (!loading) {
      storageHelper.persist('secretAddress', secretAddress);
      storageHelper.persist('scoreResponse', scoreResponse);
      storageHelper.persist('coinbaseToken', coinbaseToken);
      storageHelper.persist('plaidPublicToken', plaidPublicToken);
      storageHelper.persist(
        'plaidPublicExchangeResponse',
        plaidPublicExchangeResponse
      );
      storageHelper.persist('permissionSig', permissionSig);
      storageHelper.persist('chainActivity', chainActivity);
    }
  }, [
    secretAddress,
    coinbaseToken,
    plaidPublicToken,
    plaidPublicExchangeResponse,
    scoreResponse,
    chainActivity,
    permissionSig,
    loading,
  ]);

  // (THIS WILL RUN FIRST ON LOAD) HYDRATE CONTEXT HERE:
  useEffect(() => {
    setSecretAddress(storageHelper.get('secretAddress'));
    setCoinbaseToken(storageHelper.get('coinbaseToken'));
    setPlaidPublicToken(storageHelper.get('plaidPublicToken'));
    setPlaidPublicExchangeResponse(
      storageHelper.get('plaidPublicExchangeResponse')
    );
    setScoreResponse(storageHelper.get('scoreResponse'));
    setChainActivity(storageHelper.get('chainActivity'));
    setPermissionSig(storageHelper.get('permissionSig'));
    setLoading(false);
  }, []);

  return (
    <Context.Provider
      value={{
        disconnectWallet,
        connectRequest,
        setConnectRequest,
        loading,
        secretAddress,
        setSecretAddress,
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
        handleSetChainActivity,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { ContextProvider, useSecretContext };
