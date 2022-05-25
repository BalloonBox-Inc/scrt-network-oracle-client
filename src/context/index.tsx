import React, {
  useContext,
  createContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { notification } from 'antd';
import { useRouter } from 'next/router';
import { ItemPublicTokenExchangeResponse } from 'plaid';
import { StdSignature } from 'secretjs/types/types';

import { NOTIFICATIONS } from '../constants';
import { ICoinbaseTokenCreateResponse } from '../pages/api/coinbase';
import { IScoreResponseCoinbase, IScoreResponsePlaid } from '../types/types';

export type SecretAddress = string | null;
export type Set_Secret_Address = (address: SecretAddress) => void;
export type Void_Func = () => void;
export type Set_Connect_Request = (connectRequest: boolean) => void;
export type Set_Coinbase_Token = (coinbaseToken: Coinbase_Token) => void;
export type Coinbase_Token = ICoinbaseTokenCreateResponse | null;
export type Set_Score_Response = (
  scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null
) => void;
export type Score_Response =
  | IScoreResponseCoinbase
  | IScoreResponsePlaid
  | null;
export type Set_Plaid_Token = (plaidPublicToken: Plaid_Token) => void;
export type Set_Chain_Activity = (chainActivity: IChainActivity) => void;
export type Permission_Sig = { name: string; signature: StdSignature } | null;
export type Set_Permission_Sig = (permissionSig: Permission_Sig) => void;
export type Plaid_Token = PlaidToken | null;
export type Handle_Set_Chain_Activity = (a: IChainActivity | null) => void;
export type Plaid_Public_Exchange_Response =
  null | ItemPublicTokenExchangeResponse;
export interface ISecretContext {
  secretAddress: SecretAddress;
  setSecretAddress: Set_Secret_Address;
  loading: boolean;
  disconnectWallet: Void_Func;
  connectRequest: boolean;
  setConnectRequest: Set_Connect_Request;
  setCoinbaseToken: Set_Coinbase_Token;
  coinbaseToken: Coinbase_Token;
  setPlaidPublicToken: Set_Plaid_Token;
  plaidPublicToken: Plaid_Token;
  setScoreResponse: Set_Score_Response;
  scoreResponse: Score_Response;
  chainActivity: IChainActivity;
  setChainActivity: Set_Chain_Activity;
  permissionSig: Permission_Sig;
  setPermissionSig: Set_Permission_Sig;
  handleSetChainActivity: Handle_Set_Chain_Activity;
}

export enum CHAIN_ACTIVITIES {
  scoreSubmitted = 'scoreSubmitted',
  shareableLink = 'shareableLink',
  dataProvider = 'dataProvider',
  scoreAmount = 'scoreAmount',
  viewingKey = 'viewingKey',
  scoreMessage = 'scoreMessage',
}
export interface IChainActivity {
  [CHAIN_ACTIVITIES.scoreSubmitted]?: boolean;
  [CHAIN_ACTIVITIES.shareableLink]?: boolean;
  [CHAIN_ACTIVITIES.dataProvider]?: 'coinbase' | 'plaid';
  [CHAIN_ACTIVITIES.scoreAmount]?: number;
  [CHAIN_ACTIVITIES.scoreMessage]?: string;
  [CHAIN_ACTIVITIES.viewingKey]?: string;
}

export const CHAIN_ACTIVITY_INIT = {
  scoreSubmitted: undefined,
  shareableLink: undefined,
  dataProvider: undefined,
  scoreAmount: undefined,
  viewingKey: undefined,
  scoreMessage: undefined,
};

export interface PlaidToken {
  publicToken: string;
}

export const Context = createContext<ISecretContext | undefined>(undefined);

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

const initialState = {
  secretAddress: null,
  loading: true,
  connectRequest: false,
  scoreResponse: null,
  coinbaseToken: null,
  plaidPublicToken: null,
  chainActivity: CHAIN_ACTIVITY_INIT,
  plaidPublicExchangeResponse: null,
  permissionSig: null,
};

function contextReducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_SECRET_ADDRESS':
      return {
        ...state,
        secretAddress: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_CONNECT_REQUEST':
      return {
        ...state,
        connectRequest: action.payload,
      };
    case 'SET_SCORE_RESPONSE':
      return {
        ...state,
        scoreResponse: action.payload,
      };
    case 'SET_COINBASE_TOKEN':
      return {
        ...state,
        coinbaseToken: action.payload,
      };
    case 'SET_PLAID_PUBLIC_TOKEN':
      return {
        ...state,
        plaidPublicToken: action.payload,
      };
    case 'SET_CHAIN_ACTIVITY':
      return {
        ...state,
        chainActivity: action.payload,
      };
    case 'SET_PLAID_PUBLIC_EXCHANGE_RESPONSE':
      return {
        ...state,
        plaidPublicExchangeResponse: action.payload,
      };
    case 'SET_PERMISSION_SIG':
      return {
        ...state,
        permissionSig: action.payload,
      };
    default:
      return state;
  }
}

const ContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(contextReducer, initialState);

  const handlers = useMemo(() => {
    return {
      setSecretAddress: (address: SecretAddress) =>
        dispatch({ type: 'SET_SECRET_ADDRESS', payload: address }),
      setLoading: (loading: boolean) =>
        dispatch({ type: 'SET_LOADING', payload: loading }),
      setConnectRequest: (connectRequest: boolean) =>
        dispatch({ type: 'SET_CONNECT_REQUEST', payload: connectRequest }),
      setScoreResponse: (scoreResponse: Score_Response) =>
        dispatch({ type: 'SET_SCORE_RESPONSE', payload: scoreResponse }),
      setCoinbaseToken: (coinbaseToken: Coinbase_Token) =>
        dispatch({ type: 'SET_COINBASE_TOKEN', payload: coinbaseToken }),
      setPlaidPublicToken: (plaidPublicToken: Plaid_Token) =>
        dispatch({ type: 'SET_PLAID_PUBLIC_TOKEN', payload: plaidPublicToken }),
      setChainActivity: (chainActivity: IChainActivity) =>
        dispatch({ type: 'SET_CHAIN_ACTIVITY', payload: chainActivity }),
      setPermissionSig: (permissionSig: Permission_Sig) =>
        dispatch({ type: 'SET_PERMISSION_SIG', payload: permissionSig }),
      setPlaidPublicExchangeResponse: (
        publicExchangeResponse: Plaid_Public_Exchange_Response
      ) =>
        dispatch({
          type: 'SET_PLAID_PUBLIC_EXCHANGE_RESPONSE',
          payload: publicExchangeResponse,
        }),
    };
  }, []);

  const {
    setSecretAddress,
    setLoading,
    setConnectRequest,
    setScoreResponse,
    setCoinbaseToken,
    setPlaidPublicToken,
    setChainActivity,
    setPermissionSig,
    setPlaidPublicExchangeResponse,
  } = handlers;

  const {
    secretAddress,
    loading,
    connectRequest,
    scoreResponse,
    coinbaseToken,
    plaidPublicToken,
    chainActivity,
    permissionSig,
    plaidPublicExchangeResponse,
  } = state;

  const disconnectWallet = () => {
    setSecretAddress(null);
    setConnectRequest(false);
    setCoinbaseToken(null);
    setPlaidPublicToken(null);
    setPlaidPublicExchangeResponse(null);
    setChainActivity(CHAIN_ACTIVITY_INIT);
    localStorage.clear();
    notification.success({
      message: NOTIFICATIONS.WALLET_DISCONNECT_SUCCESS,
    });
  };

  const router = useRouter();

  useEffect(() => {
    const returnHome = () => {
      if (typeof window !== 'undefined') {
        (router?.pathname.includes('applicant') ||
          router?.pathname.includes('provider')) &&
          router.push('/');
      }
    };
    // use this to rerouter user to home page if router includes 'applicant' or 'provider'
    if (!loading) {
      !secretAddress && returnHome();
    }
  }, [secretAddress, loading, router]);

  useEffect(() => {
    secretAddress && setConnectRequest(false);
  }, [secretAddress]);

  const handleSetChainActivity = (val: IChainActivity | null) => {
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
