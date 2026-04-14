import { QueryClient } from "@tanstack/react-query";

// Production-ready Query Client with sensible defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // retry failed requests twice
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // exponential backoff
      //   staleTime: 5 * 60 * 1000, // 5 minutes before refetch
      //   cacheTime: 10 * 60 * 1000, // data stays in cache for 10 min

      refetchOnWindowFocus: true, //  refetch on tab switch
      refetchOnReconnect: true, // refetch if network reconnects
    },
    mutations: {
      retry: 1, // retry failed mutations once
    },
  },
});
