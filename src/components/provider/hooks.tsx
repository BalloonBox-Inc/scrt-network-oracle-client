import { useReducer, useMemo } from 'react';

import {
  IPermitQueryResponse,
  IScoreQueryResponse,
} from '@scrtsybil/src/types/contract';

const PERMIT_FORM_ORIGINAL = {
  permitName: '',
  publicAddress: '',
  permitSignature: '',
};

const VIEWING_KEY_FORM_ORIGINAL = {
  address: '',
  key: '',
};

interface IProviderState {
  selection: 'permit' | 'viewingKey' | null;
  showModal: boolean;
  status: 'loading' | 'success' | undefined;
  permitData: {
    permitName: string;
    publicAddress: string;
    permitSignature: string;
  };
  viewingKey: { address: string; key: string };
  queryPermitResponse: undefined | IPermitQueryResponse;
  queryViewingKeyResponse: undefined | IScoreQueryResponse;
}

const initialState: IProviderState = {
  selection: null,
  showModal: false,
  status: undefined,
  permitData: PERMIT_FORM_ORIGINAL,
  viewingKey: VIEWING_KEY_FORM_ORIGINAL,
  queryViewingKeyResponse: undefined,
  queryPermitResponse: undefined,
};

function providerReducer(state: any, action: any) {
  switch (action.type) {
    // SELECTION
    case 'SET_SELECTION_VIEWING_KEY':
      return {
        ...state,
        selection: 'viewingKey',
      };
    case 'SET_SELECTION_PERMIT':
      return {
        ...state,
        selection: 'permit',
      };

    case 'SET_SELECTION_CLEAR':
      return {
        ...state,
        selection: null,
      };

    //  VIEWING KEY
    case 'SET_RESET_VIEWING_KEY':
      return {
        ...state,
        viewingKey: VIEWING_KEY_FORM_ORIGINAL,
      };
    case 'SET_VIEWING_KEY':
      return {
        ...state,
        viewingKey: action.viewingKeyData,
      };

    // Status
    case 'SET_STATUS_LOADING':
      return {
        ...state,
        status: 'loading',
      };
    case 'SET_STATUS_SUCCESS':
      return {
        ...state,
        status: 'success',
      };
    case 'SET_STATUS_CLEAR':
      return {
        ...state,
        status: undefined,
      };

    // PERMIT
    case 'SET_PERMIT_DATA':
      return {
        ...state,
        permitData: action.permitData,
      };
    case 'SET_CLEAR_PERMIT_DATA':
      return {
        ...state,
        permitData: PERMIT_FORM_ORIGINAL,
      };

    // QUERY
    case 'SET_QUERY_PERMIT_RESPONSE':
      return {
        ...state,
        queryPermitResponse: action.queryPermitResponse,
      };
    case 'SET_QUERY_VIEWING_KEY_RESPONSE':
      return {
        ...state,
        queryViewingKeyResponse: action.queryViewingKeyResponse,
      };

    // Modal
    case 'SET_SHOW_MODAL':
      return {
        ...state,
        showModal: true,
      };
    case 'SET_HIDE_MODAL':
      return {
        ...state,
        showModal: false,
      };
    default:
      return state;
  }
}

export function useProviderReducer() {
  const [state, dispatch] = useReducer(providerReducer, initialState);
  const handlers = useMemo(() => {
    return {
      // Selection
      setSelectionViewingKey: () =>
        dispatch({ type: 'SET_SELECTION_VIEWING_KEY' }),
      setSelectionPermit: () => dispatch({ type: 'SET_SELECTION_PERMIT' }),
      setSelectionClear: () => dispatch({ type: 'SET_SELECTION_CLEAR' }),
      // Viewing Key
      setResetViewingKey: () => dispatch({ type: 'SET_RESET_VIEWING_KEY' }),
      setViewingKey: (viewingKeyData: any) =>
        dispatch({ type: 'SET_VIEWING_KEY', viewingKeyData }),
      // Status
      setStatusLoading: () => dispatch({ type: 'SET_STATUS_LOADING' }),
      setStatusSuccess: () => dispatch({ type: 'SET_STATUS_SUCCESS' }),
      setStatusClear: () => dispatch({ type: 'SET_STATUS_CLEAR' }),
      // Permit
      setPermitData: (permitData: any) =>
        dispatch({ type: 'SET_PERMIT_DATA', permitData }),
      setClearPermitData: () => dispatch({ type: 'SET_CLEAR_PERMIT_DATA' }),
      // Query
      setQueryPermitResponse: (queryPermitResponse: any) =>
        dispatch({ type: 'SET_QUERY_PERMIT_RESPONSE', queryPermitResponse }),
      setQueryViewingKeyResponse: (queryViewingKeyResponse: any) =>
        dispatch({
          type: 'SET_QUERY_VIEWING_KEY_RESPONSE',
          queryViewingKeyResponse,
        }),
      // Modal
      setShowModal: () => dispatch({ type: 'SET_SHOW_MODAL' }),
      setHideModal: () => dispatch({ type: 'SET_HIDE_MODAL' }),
    };
  }, []);
  return [state, handlers] as const;
}
