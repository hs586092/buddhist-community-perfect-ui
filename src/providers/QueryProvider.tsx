import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (failureCount < 2) {
                return true
              }
              // Don't retry on 4xx errors except for 408 (timeout)
              if (
                error instanceof Error &&
                'status' in error &&
                typeof error.status === 'number' &&
                error.status >= 400 &&
                error.status < 500 &&
                error.status !== 408
              ) {
                return false
              }
              return failureCount < 3
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  )

  const isDev = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true'

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}