'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#00AD1D', // Vibrant green
    },
    secondary: {
      main: '#00E026', // Deep magenta
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: 'sans-serif',
    h1: {
      fontFamily: '"Times New Roman", Times, serif',
    },
    h2: {
      fontFamily: '"Times New Roman", Times, serif',
    },
    body1: {
      fontFamily: 'sans-serif',
    },
    button: {
      fontFamily: 'sans-serif',
      textTransform: 'none', // Optional: avoids uppercase buttons
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Softer button corners
        },
      },
    },
  },
});