import { QueryClient } from '@tanstack/react-query';

const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: false,
        networkMode: 'offlineFirst',
        // cacheTime: 1000 * 60 * 5, // 5 minutes
        // staleTime: 1000 * 60 * 1, // 1 minutes
        retry: 3,
      },
    },
  });

export default getQueryClient;
