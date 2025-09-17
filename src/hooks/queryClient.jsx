// queryClient.ts
import { QueryClient } from '@tanstack/react-query';

let suspenseFetchCount = 0;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true, // enable suspense globally or per query
      useErrorBoundary: true,
    },
  },
});

// Listen to fetching changes
queryClient.getQueryCache().subscribe((event) => {
  if (event.query?.state.isFetching && !event.query?.state.data) {
    // Only count "suspense" fetches (no cached data yet)
    suspenseFetchCount++;

    // ✅ Suspense loading started → block Axios loader
    document.body.classList.add('react-query-fetching');
  } else if (!event.query?.state.isFetching) {
    // Fetch ended
    if (suspenseFetchCount > 0) suspenseFetchCount--;
    if (suspenseFetchCount === 0) {
      document.body.classList.remove('react-query-fetching');
    }
  }
});