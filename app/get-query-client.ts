import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

import { UnauthorizedError } from "@/lib/error";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { 
        staleTime: 5 * 60 * 1000,
        // gcTime: 10 * 60 * 1000, // 10 minutes - how long to keep unused data in cache
        retry: (failureCount, error) => {
          if (error instanceof UnauthorizedError) return false;
          if (error instanceof Error && error.message.includes("Network Error"))
            return true;
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
