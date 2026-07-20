import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';

import '@/lib/i18n/i18n';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import "@/lib/zod"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
