'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Reduce staleTime to make data refresh more frequently
            staleTime: 1000 * 30, // 30 seconds
            // Enable background refetches
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            // Retry failed requests 3 times
            retry: 3,
            // Add polling for real-time updates
            refetchInterval: 1000 * 60, // Refetch every minute
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
} 