import createCache from '@emotion/cache';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import { theme } from './theme';
import { ReactNode } from 'react';

export default function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

const cache = createEmotionCache();

interface StyledRootProps {
  children: ReactNode;
}

export function StyledRoot({ children } : StyledRootProps ) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}