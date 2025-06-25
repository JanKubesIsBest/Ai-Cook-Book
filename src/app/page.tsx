import SearchComponent from '@/components/search/search-component';
import WhyUseAppCard from '@/components/whyToUseThisApp/whyToUseThisApp';

import { Container, Typography, Box, Grid } from '@mui/material';

export default function Home() {
  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}> {/* Added vertical padding for the main container */}
        <Typography variant="h1" sx={{ mb: 4 }}> {/* Added bottom margin */}
          <span>What would you like </span>
          <Typography component="span" variant="inherit" sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>
            to eat?
          </Typography>
        </Typography>

        <Box sx={{ mb: 2 }}>
          <SearchComponent placeholderText={'What would you like to eat? What do you want to use? What do you have at home?'} />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h3" sx={{ mb: 1 }}> 
            How to use this app?
          </Typography>
          <Typography variant="body1">
            Are you tired of deciding what do you want to cook?{' '}
            <Typography component="strong" variant="inherit" sx={{ fontWeight: 'bold' }}>
              Just tell ai:
            </Typography>
          </Typography>
        </Box>

        <Grid container columnSpacing={4} rowSpacing={1} justifyContent="center">
          <Grid xs={12} sm={6} md={6} lg={6}>
            <WhyUseAppCard
              icon={'🥦'}
              title={'What ingredients would you like to use?'}
              description={'Cook from ingredients you have or would like to use. Choice is yours!'}
              gradientColorStart="#00AD1D"
              gradientColorEnd="#00E026"
            />
          </Grid>
          <Grid xs={12} sm={6} md={6} lg={6}>
            <WhyUseAppCard
              icon={'🍕'}
              title={'What do you fancy?'}
              description={'Describe what would you like to eat, what is on your mind for the meal?'}
              gradientColorStart="#FF7043" 
              gradientColorEnd="#F44336"   
            />
          </Grid>
          <Grid xs={12} sm={6} md={6} lg={6}>
            <WhyUseAppCard
              icon={'🏋️'}
              title={'What is your nutritional goal?'}
              description={'Are you a runner and need more carbs? Are you on caloric deficit or are you trying to bulk?'}
              gradientColorStart="#2196F3" // Example: Blue for fitness
              gradientColorEnd="#4CAF50"   // Example: Green for fitness
            />
          </Grid>
          <Grid xs={12} sm={6} md={6} lg={6}>
            <WhyUseAppCard
              icon={'🍊'}
              title={'Are you lost in a recipe?'}
              description={'Just ask Ai your question and it will answer - which way should I cook the meat, how should the orange look when buying...'}
              gradientColorStart="#FFB300" // Example: Amber for inquiry
              gradientColorEnd="#FB8C00"   // Example: Darker orange
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}