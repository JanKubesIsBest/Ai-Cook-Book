"use client";

import React, { useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { Stack, Button, Box } from '@mui/material';

// Props interface - UPDATED to include initialSelectedStyles
interface SearchComponentProps {
  placeholderText: string;
  onSearchSubmit?: (query: string, styles: string[]) => void;
  initialValue?: string;
  initialSelectedStyles?: string[]; // New prop for initial selected buttons
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  placeholderText,
  initialValue = '',
  onSearchSubmit,
  initialSelectedStyles = [] // Default to an empty array if not provided
}) => {
  const router = useRouter();
  const [currentQuery, setCurrentQuery] = useState<string>(initialValue);
  // Initialize selectedButtons state with initialSelectedStyles
  const [selectedButtons, setSelectedButtons] = useState<string[]>(initialSelectedStyles);

  const handleSearch = (query: string) => {
    if (onSearchSubmit != null) {
      onSearchSubmit(query, selectedButtons); // Pass both query and selectedButtons
    } else {
      console.log('Search submitted:', query, 'with styles:', selectedButtons);
      // Constructing the URL with styles
      const encodedQuery = encodeURIComponent(query);
      const encodedStyles = selectedButtons.length > 0
        ? `&styles=${encodeURIComponent(selectedButtons.join(','))}` // Join styles with comma
        : '';
      router.push(`/search?q=${encodedQuery}${encodedStyles}`);
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