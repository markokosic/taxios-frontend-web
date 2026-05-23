import '@mantine/core/styles.css';

import { Suspense, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { MainErrorFallback } from '@/components/errors/MainErrorFallback';
import { theme } from '@/config/theme';
import queryClient from '@/lib/queryClient';

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({ children: app }: AppProviderProps) => {
  const [showDevtools, setShowDevtools] = useState(false);
  const { i18n } = useTranslation();

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <Suspense fallback={null}>
            <DatesProvider settings={{ locale: i18n.resolvedLanguage }}>
              <ModalsProvider>
                {app}
                <Toaster position="top-center" />
                {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
              </ModalsProvider>
            </DatesProvider>
          </Suspense>
        </MantineProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export { AppProvider };
