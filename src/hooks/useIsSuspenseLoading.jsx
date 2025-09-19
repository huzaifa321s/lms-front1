import { useState, useEffect } from 'react';
import { useIsFetching } from '@tanstack/react-query';

export function useIsSuspenseLoading() {
  const isFetching = useIsFetching();
  const [suspenseLoading, setSuspenseLoading] = useState(false);

  useEffect(() => {
    // If any queries are fetching, mark suspense loading true
    setSuspenseLoading(isFetching > 0);
  }, [isFetching]);

  return suspenseLoading;
}
