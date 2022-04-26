import { useState, useMemo } from 'react';

export function useSetStatus() {
  const [status, setStatus] = useState<
    'loading' | 'error' | 'success' | undefined
  >(undefined);

  const handlers = useMemo(() => {
    return {
      setLoadingStatus: () => setStatus('loading') as any,
      setErrorStatus: () => setStatus('error'),
      setSuccessStatus: () => setStatus('success'),
    };
  }, []);

  const currentStatus = useMemo(() => {
    return {
      statusLoading: status === 'loading',
      statusSuccess: status === 'success',
    };
  }, [status]);

  return [currentStatus, handlers] as const;
}
