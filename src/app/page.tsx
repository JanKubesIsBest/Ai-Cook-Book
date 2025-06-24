'use client';

import { useRouter } from 'next/navigation';
import SearchComponent from '@/components/search/search-component';

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { Stack } from '@mui/material';


export default function Home() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    console.log('Search submitted:', query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <Container maxWidth="md">


        <Typography variant="h1" color="initial">
          <span>What would you like </span>
          <span className='bold italic'>to eat?</span>
        </Typography>

        <Container sx={{ mt: 1, p: 0}} disableGutters>
          <SearchComponent
            placeholderText='What would you like to eat? What do you want to use? What do you have at home?'
            onSearchSubmit={handleSearch}
          ></SearchComponent>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="outlined" >
              <strong>Healthy</strong>
            </Button>
            <Button variant="outlined">
              <strong>Low Calories</strong>
            </Button>
            <Button variant="outlined">
              <strong>High Protein</strong>
            </Button>
            <Button variant="outlined">
              <strong>Vegetarian</strong>
            </Button>
          </Stack>
        </Container>

      </Container>
    </>
  );
}