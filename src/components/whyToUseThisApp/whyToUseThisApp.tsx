import React from 'react';
import { Box, Typography } from '@mui/material';

interface WhyUseAppCardProps {
  icon: string;
  title: string;
  description: string;
  gradientColorStart?: string;
  gradientColorEnd?: string;
}

const WhyUseAppCard: React.FC<WhyUseAppCardProps> = ({
  icon,
  title,
  description,
  gradientColorStart = '#00AD1D',
  gradientColorEnd = '#00E026',
}) => {
  const boxShadowColor = gradientColorEnd;

  return (
    <Box
      sx={{
        position: 'relative',
        p: '1px',
        borderRadius: 4,
        background: `linear-gradient(45deg, ${gradientColorStart}, ${gradientColorEnd})`,
        display: 'inline-block',
        overflow: 'hidden',
        maxWidth: { xs: '100%', sm: 400 },
        mx: 'auto',
        my: 2,
        boxShadow: `0px 0px 15px ${boxShadowColor}4D`,
        textAlign: 'left',
        height: 250
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 4,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography
          variant="h3"
          component="span"
          sx={{ mb: 2, fontSize: '2.5rem' }}
        >
          {icon}
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 'bold',
            mb: 0,
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default WhyUseAppCard;
