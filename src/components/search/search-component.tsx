"use client";

import React, { useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { Stack, Button, Box } from '@mui/material'; // Import Box for scrollable container

interface SearchComponentProps {
  placeholderText: string;
  onSearchSubmit?: (query: string) => void;
  initialValue?: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  placeholderText,
  initialValue = '',
  onSearchSubmit
}) => {
  const router = useRouter();
  const [currentQuery, setCurrentQuery] = useState<string>(initialValue);
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]); // State to track selected buttons

  const handleSearch = (query: string) => {
    if (onSearchSubmit != null) {
      onSearchSubmit(query);
    } else {
      console.log('Search submitted:', query);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && currentQuery.trim()) {
      event.preventDefault();
      handleSearch(currentQuery.trim());
    }
  };

  const handleIconClick = () => {
    if (currentQuery.trim()) {
      handleSearch(currentQuery.trim());
    }
  };

  const handleButtonClick = (buttonText: string) => {
    setSelectedButtons(prevSelectedButtons => {
      if (prevSelectedButtons.includes(buttonText)) {
        return prevSelectedButtons.filter(text => text !== buttonText); // Deselect
      } else {
        return [...prevSelectedButtons, buttonText]; // Select
      }
    });
  };

  const buttons = ['Healthy', 'Low Calories', 'High Protein', 'Vegetarian'];

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 2 }} disableGutters>
      <TextField
        id="search-input"
        label={placeholderText}
        value={currentQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        fullWidth
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disabled={!currentQuery.trim()}
                onClick={handleIconClick}
                aria-label="submit search"
                disableRipple
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        aria-label="search input"
      />

      {/* Box for horizontal scrolling */}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          overflowX: 'auto', // Enable horizontal scrolling
          '&::-webkit-scrollbar': {
            display: 'none', // Hide scrollbar for a cleaner look
          },
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          pb: 1, // Add some padding bottom in case scrollbar appears on some systems
        }}
      >
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}> {/* Prevent buttons from shrinking */}
          {buttons.map((text) => (
            <Button
              key={text}
              variant={selectedButtons.includes(text) ? 'contained' : 'outlined'} // Change variant based on selection
              onClick={() => handleButtonClick(text)}
              sx={{ flexShrink: 0 }} // Ensure buttons don't shrink
            >
              <strong>{text}</strong>
            </Button>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default SearchComponent;