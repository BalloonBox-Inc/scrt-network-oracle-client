import { useState, useMemo, useEffect } from 'react';

import { useRouter } from 'next/router';
import { isEmpty } from 'ramda';

export function useInputData() {
  const [inputData, setInputData] = useState<string | undefined>('');

  const handlers = useMemo(() => {
    return {
      clearInputData: () => setInputData(undefined),
      setInput: (data: string) => setInputData(data),
    };
  }, []);

  return [inputData, handlers] as const;
}

export function useSetStatus() {
  const [status, setStatus] = useState<string | undefined>(undefined);

  const handlers = useMemo(() => {
    return {
      setLoadingStatus: () => setStatus('loading'),
      clearStatus: () => setStatus(undefined),
    };
  }, []);

  return [status, handlers] as const;
}

export function useHandlePermitType() {
  const [revokeOrCreate, setRevokeOrCreate] = useState<
    'revoke' | 'create' | null
  >(null);

  const handlers = useMemo(() => {
    return {
      setRevokePermit: () => setRevokeOrCreate('revoke'),
      setCreatePermit: () => setRevokeOrCreate('create'),
    };
  }, []);

  const states = useMemo(() => {
    return {
      isRevokePermit: revokeOrCreate === 'revoke',
      isCreatePermit: revokeOrCreate === 'create',
    };
  }, [revokeOrCreate]);

  return [states, handlers] as const;
}

export function useManageRouterQuery({
  setCreatePermit,
  setRevokePermit,
}: any) {
  const router = useRouter();

  useEffect(() => {
    isEmpty(router.query) && router.replace('/applicant/permit?type=create');
  }, [router]);

  useEffect(() => {
    if (router.query?.type === 'revoke') {
      setRevokePermit();
    }
    if (router.query?.type === 'create') {
      setCreatePermit();
    }
  }, [router, setCreatePermit, setRevokePermit]);

  return null;
}
