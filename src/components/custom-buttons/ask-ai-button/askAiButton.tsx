import React from 'react';
import { Button, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface AskAiButtonProps {
  onClick: () => void;
  buttonText?: string;
  disabled?: boolean;
}

const AskAiButton: React.FC<AskAiButtonProps> = ({
  onClick,
  buttonText = 'Help',
  disabled = false,
}) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      sx={{
        bgcolor: '#00AD1D',
        color: '#FFFFFF',
        borderRadius: 999,
        fontWeight: 'bold',
        boxShadow: 'none',
        '&:hover': {
          bgcolor: '#00C220',
          boxShadow: 'none',
        },
        '&:active': {
          bgcolor: '#009919',
          boxShadow: 'none',
        },
        '&.Mui-disabled': {
          bgcolor: '#a5d6a7',
          color: '#e0e0e0',
        },
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 'unset',
        whiteSpace: 'nowrap',
      }}
      endIcon={
        <SearchIcon
          sx={{
            color: 'white',
            fontSize: '0.875rem', // Set icon size to match body2 (which is typically 14px)
            ml: 0.1,
          }}
        />
      }
    >
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}> {/* Applied font weight to Typography */}
            {buttonText}
        </Typography>
    </Button>
  );
};

export default AskAiButton;
