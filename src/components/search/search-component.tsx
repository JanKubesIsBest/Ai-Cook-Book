"use client";

import React, { useState } from 'react';
import Container from '@mui/material/Container';
import { Stack, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomSearchTextField from './custom-textfield'; // Import the new custom component

// Props interface
interface SearchComponentProps {
  placeholderText: string;
  onSearchSubmit?: (query: string, styles: string[]) => void;
  initialValue?: string;
  initialSelectedStyles?: string[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  placeholderText,
  initialValue = '',
  onSearchSubmit,
  initialSelectedStyles = []
}) => {
  const router = useRouter();
  const [currentQuery, setCurrentQuery] = useState<string>(initialValue);
  const [selectedButtons, setSelectedButtons] = useState<string[]>(initialSelectedStyles);

  const handleSearch = (query: string) => {
    if (onSearchSubmit != null) {
      onSearchSubmit(query, selectedButtons);
    } else {
      console.log('Search submitted:', query, 'with styles:', selectedButtons);
      const encodedQuery = encodeURIComponent(query);
      const encodedStyles = selectedButtons.length > 0
        ? `&styles=${encodeURIComponent(selectedButtons.join(','))}`
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
        return prevSelectedButtons.filter(text => text !== buttonText);
      } else {
        return [...prevSelectedButtons, buttonText];
      }
    });
  };

  const buttons = ['Healthy', 'Low Calories', 'High Protein', 'Vegetarian'];

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 2 }} disableGutters>
      {/* Replaced TextField with CustomSearchTextField */}
      <CustomSearchTextField
        id="search-input"
        placeholderText={placeholderText} // Passing the placeholder text from props
        value={currentQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onSearchIconClick={handleIconClick}
        isSearchIconDisabled={!currentQuery.trim()} // Disable if query is empty
        ariaLabel="search input"
      />

      {/* Box for horizontal scrolling */}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          pb: 1,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          {buttons.map((text) => (
            <Button
              key={text}
              variant={selectedButtons.includes(text) ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick(text)}
              sx={{ flexShrink: 0 }}
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
