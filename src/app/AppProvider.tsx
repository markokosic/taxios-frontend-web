import '@mantine/core/styles.css';

import { Suspense, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { MainErrorFallback } from '@/components/errors/MainErrorFallback';
import { theme } from '@/config/theme';
import queryClient from '@/lib/queryClient';

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({ children: app }: AppProviderProps) => {
  const [showDevtools, setShowDevtools] = useState(false);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          APP PROVIDER LOADER BLA BLA{' '}
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              {app}
              <Toaster position="top-center" />
              {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
            </ModalsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
};

export { AppProvider };
