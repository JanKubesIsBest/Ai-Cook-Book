import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({ // Use 'let' so we can reassign after responsiveFontSizes
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
      'Helvetica Neue',
      'Helvetica',
      'Arial',
      'sans-serif',
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
    body2: {
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
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Apply responsive font sizes to the theme
theme = responsiveFontSizes(theme);

export { theme };