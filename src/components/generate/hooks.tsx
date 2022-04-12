import { useState, useMemo, useEffect } from 'react';

export function useHandleSelection() {
  const [selection, setSelection] = useState<string | undefined>(undefined);

  const handlers = useMemo(() => {
    return {
      setToCoinbase: () => setSelection('coinbase'),
      setToPlaid: () => setSelection('plaid'),
    };
  }, []);

  const selections = useMemo(() => {
    return {
      coinbaseSelected: selection === 'coinbase',
      plaidSelected: selection === 'plaid',
      noneSelected: selection === undefined,
    };
  }, [selection]);

  return [selections, handlers] as const;
}

export function useHandleAwaitingScoreResponse() {
  const [awaitingScoreResponse, setAwaitingScoreResponse] =
    useState<boolean>(false);

  const handlers = useMemo(() => {
    return {
      setToWaiting: () => setAwaitingScoreResponse(true),
      setNotWaiting: () => setAwaitingScoreResponse(false),
    };
  }, []);

  return [awaitingScoreResponse, handlers] as const;
}

export function useManageExistingScore({
  chainActivity,
  setExistingScoreToTrue,
  setExistingScoreToFalse,
  queryType,
  router,
}: any) {
  useEffect(() => {
    if (chainActivity?.scoreSubmitted) {
      setExistingScoreToTrue();
      !!queryType && router.replace('/applicant/generate');
    } else setExistingScoreToFalse();
  }, [
    chainActivity,
    queryType,
    router,
    setExistingScoreToFalse,
    setExistingScoreToTrue,
  ]);
}

export function useManageQuery({
  router,
  setStartCoinbase,
  setToWaiting,
}: any) {
  useEffect(() => {
    router?.query?.code && setStartCoinbase(true);
  }, [router?.query, setStartCoinbase]);

  useEffect(() => {
    router?.query?.status === 'loading' && setToWaiting();
  }, [router?.query, setToWaiting]);
}

export function useHandleSdk() {
  const [sdk, setSdk] = useState<string | undefined>(undefined);

  const handlers = useMemo(() => {
    return {
      setStartCoinbase: () => setSdk('coinbase'),
      setStartPlaidLink: () => setSdk('plaid'),
      setSdkUndefined: () => setSdk(undefined),
    };
  }, []);

  const startCoinbase = sdk === 'coinbase';
  const startPlaidLink = sdk === 'plaid';

  return [startPlaidLink, startCoinbase, handlers] as const;
}

export function useHandleExistingScore() {
  const [isExistingScore, setIsExistingScore] = useState<
    'loading' | true | false
  >('loading');

  const handlers = useMemo(() => {
    return {
      setExistingScoreToTrue: () => setIsExistingScore(true),
      setExistingScoreToFalse: () => setIsExistingScore(false),
    };
  }, []);

  const existingScoreIsLoading = isExistingScore === 'loading';
  const scoreExists = !!isExistingScore;

  return [existingScoreIsLoading, scoreExists, handlers] as const;
}
