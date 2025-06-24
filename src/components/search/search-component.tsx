"use client"; 

import React, { useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search'; // Using MUI's SearchIcon
import { useRouter } from 'next/navigation';

// Props interface
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

  const handleSearch = (query: string) => {
    if (onSearchSubmit != null) {
      onSearchSubmit(query)
    } else {
      console.log('Search submitted:', query);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // State to manage the current value of the search input
  const [currentQuery, setCurrentQuery] = useState<string>(initialValue);

  // Handle input changes, updating the currentQuery state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuery(event.target.value);
  };

  // Handle Enter key press for submission
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && currentQuery.trim()) {
      event.preventDefault(); // Prevent default form submission behavior
      handleSearch(currentQuery.trim()); // Call the submit handler with the trimmed query
    }
  };

  // Handle click on the search icon for submission
  const handleIconClick = () => {
    if (currentQuery.trim()) {
      handleSearch(currentQuery.trim()); // Call the submit handler with the trimmed query
    }
  };

  return (
    // Container to center the TextField and provide horizontal padding on larger screens
    <Container maxWidth="md" sx={{ mt: 2, mb: 2 }} disableGutters>
      <TextField
        // Unique ID for accessibility and linking label to input
        id="search-input"
        // Label for the TextField, acting as the placeholder
        label={placeholderText}
        // Value of the input field, controlled by React state
        value={currentQuery}
        // Handler for changes in the input field
        onChange={handleInputChange}
        // Handler for keyboard events, specifically 'Enter' key for submission
        onKeyDown={handleKeyDown}
        // Full width to make it responsive
        fullWidth
        // Standard outlined variant for a clear visual style
        variant="outlined"
        // InputProps to add an adornment (the search icon)
        InputProps={{
          endAdornment: ( // Adornment at the end of the input
            <InputAdornment position="end">
              <IconButton
                // Disable button if query is empty to prevent unnecessary calls
                disabled={!currentQuery.trim()}
                // Handler for clicking the search icon
                onClick={handleIconClick}
                // Aria label for accessibility
                aria-label="submit search"
                // No ripple effect for a cleaner interaction (optional)
                disableRipple
              >
                <SearchIcon /> {/* Material-UI Search Icon */}
              </IconButton>
            </InputAdornment>
          ),
        }}
        // Aria label for the input field itself
        aria-label="search input"
      />
    </Container>
  );
};

export default SearchComponent;
