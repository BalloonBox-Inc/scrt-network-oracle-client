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
    React.SetStateAction<ICoinbaseTokenCreateResponse | undefined>
  >;
  coinbaseToken: ICoinbaseTokenCreateResponse | undefined;
  setPlaidPublicToken: React.Dispatch<
    React.SetStateAction<undefined | PlaidToken>
  >;
  plaidPublicToken: PlaidToken | undefined;

  setScoreResponse: React.Dispatch<
    React.SetStateAction<
      IScoreResponseCoinbase | IScoreResponsePlaid | undefined
    >
  >;
  scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | undefined;
  chainActivity: IChainActivity;
  setChainActivity: React.Dispatch<React.SetStateAction<IChainActivity>>;
  permissionSig?: { name: string; signature: StdSignature };
  setPermissionSig: React.Dispatch<
    React.SetStateAction<{ name: string; signature: StdSignature } | undefined>
  >;
  handleAddToChainActivity: (
    k: CHAIN_ACTIVITIES,
    value: string | number | boolean
  ) => void;
  handleSetChainActivity: any;
}

export enum CHAIN_ACTIVITIES {
  scoreSubmitted = 'scoreSubmitted',
  permissionKeys = 'permissionKeys',
  viewingKeys = 'viewingKeys',
  shareableLink = 'shareableLink',
  dataProvider = 'dataProvider',
  scoreAmount = 'scoreAmount',
}
export interface IChainActivity {
  [CHAIN_ACTIVITIES.scoreSubmitted]?: boolean;
  [CHAIN_ACTIVITIES.permissionKeys]?: string[];
  [CHAIN_ACTIVITIES.viewingKeys]?: string[];
  [CHAIN_ACTIVITIES.shareableLink]?: boolean;
  [CHAIN_ACTIVITIES.dataProvider]?: 'coinbase' | 'plaid';
  [CHAIN_ACTIVITIES.scoreAmount]?: number;
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

const CHAIN_ACTIVITY_INIT = {
  scoreSubmitted: undefined,
  permissionKeys: undefined,
  viewingKeys: undefined,
  shareableLink: undefined,
  dataProvider: undefined,
  scoreAmount: undefined,
};

const ContextProvider = ({ children }: any) => {
  const [secretAddress, setSecretAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectRequest, setConnectRequest] = useState<boolean>(false);
  const [scoreResponse, setScoreResponse] = useState<
    IScoreResponseCoinbase | IScoreResponsePlaid | undefined
  >(undefined);
  const [coinbaseToken, setCoinbaseToken] = useState<
    ICoinbaseTokenCreateResponse | undefined
  >(undefined);
  const [plaidPublicToken, setPlaidPublicToken] = useState<
    undefined | PlaidToken
  >(undefined);
  const [chainActivity, setChainActivity] =
    useState<IChainActivity>(CHAIN_ACTIVITY_INIT);
  const [plaidPublicExchangeResponse, setPlaidPublicExchangeResponse] =
    useState<undefined | ItemPublicTokenExchangeResponse>(undefined);

  const [permissionSig, setPermissionSig] = useState<
    { name: string; signature: StdSignature } | undefined
  >(undefined);

  const handleAddToChainActivity = (
    key: CHAIN_ACTIVITIES,
    value: string | number | boolean
  ) => {
    if (chainActivity) {
      const existingValue = chainActivity[key];
      if (
        key === CHAIN_ACTIVITIES.permissionKeys ||
        key === CHAIN_ACTIVITIES.viewingKeys
      ) {
        const doesNewValueExist = (existingValue as string[]).includes(
          value as string
        );
        if (doesNewValueExist) return;
        setChainActivity({
          ...chainActivity,
          [key]: (existingValue as string[])?.length
            ? [...(existingValue as string[]), value]
            : [value],
        });
      } else {
        setChainActivity({
          ...chainActivity,
          [key]: value,
        });
      }
    }
  };

  const disconnectWallet = () => {
    setSecretAddress(null);
    setConnectRequest(false);
    setCoinbaseToken(undefined);
    setPlaidPublicToken(undefined);
    setPlaidPublicExchangeResponse(undefined);
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

  // PERSIST TO STORAGE HERE:
  useEffect(() => {
    // secretjs && storageHelper.persist('secretjs', secretjs);
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
    permissionSig && storageHelper.persist('permissionSig', permissionSig);
    setLoading(false);
  }, [
    // secretjs,
    secretAddress,
    coinbaseToken,
    plaidPublicToken,
    plaidPublicExchangeResponse,
    scoreResponse,
    chainActivity,
    permissionSig,
  ]);

  // HYDRATE CONTEXT HERE:
  useEffect(() => {
    // setSecretjs(storageHelper.get('secretjs'));
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
        handleAddToChainActivity,
        handleSetChainActivity,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { ContextProvider, useSecretContext };
