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
    fontFamily: [
      'Helvetica Neue', // Prioritize Helvetica Neue
      'Helvetica',      // Fallback to Helvetica
      'Arial',          // Common sans-serif fallback
      'sans-serif',     // Generic sans-serif fallback
    ].join(','),
    h1: {
      fontFamily: '"Times New Roman", Times, serif',
    },
    h2: {
      fontFamily: '"Times New Roman", Times, serif',
    },
    h3: {
      fontFamily: '"Times New Roman", Times, serif',
    },
    h4: {
      fontFamily: '"Times New Roman", Times, serif',
    },
    h5: {
      fontFamily: '"Times New Roman", Times, serif',
    },
    body1: {
      fontFamily: [
        'Helvetica Neue',
        'Helvetica',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    body2: { // Often good to explicitly set body2 as well if used
      fontFamily: [
        'Helvetica Neue',
        'Helvetica',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    button: {
      fontFamily: [
        'Helvetica Neue',
        'Helvetica',
        'Arial',
        'sans-serif',
      ].join(','),
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